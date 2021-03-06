import {IConnectionConfig, QueryOptions, SugoiModelException, SortItem, SortOptions} from "../index";
import {Dummy} from "./models/dummy";
import {NotModel} from "./models/not-model";
import {ModelAbstract} from "../models/model.abstract";
import {DummyConnection} from "./classes/dummy-connection.class";
import {ConnectionName} from "../decorators/connection-name.decorator";
import {ModelName} from "../decorators/model-name.decorator";
import {SubDummy} from "./models/sub-dummy";

const exceptionCheck = {
    toBeExceptionOf(received, expected: { type: any, message: string, code: number, data?: any[] }) {
        const type = expected.type;
        const message = expected.message;
        const code = expected.code;
        const data = expected.data;
        const isInstance = received instanceof type;
        if (!isInstance) {
            return {
                pass: false,
                message: () => `expected ${received.name} not of type ${type.nanme}`,
            }
        }

        if (received.message !== message) {
            return {
                pass: false,
                message: () => `expected ${message} got ${received.message}`,
            }
        }

        if (received.code !== code) {
            return {
                pass: false,
                message: () => `expected ${code} got ${received.code}`,
            }
        }
        if (data) {
            return {
                pass: JSON.stringify(data) === JSON.stringify(received.data),
                message: () => this.pass ? `expected data equals` : `expected data ${JSON.stringify(data)}, received ${JSON.stringify(received.data)}`
            };
        }

        return {
            pass: true,
            message: () => `expected equal to what got`,
        }


    }
};
expect.extend(exceptionCheck);

const recAmount = 10;
const recNamePrefix = "read_name_";
let mockObject,
    MockId,
    connection;

async function setResources() {
    const p = [];
    for (let i = 0; i < recAmount; i++) {
        const dummy = Dummy.builder(`${recNamePrefix}${i}`);
        p.push(dummy.save());
    }
    Promise.race(p)
        .then(first => {
            delete  first.saved;
            mockObject = first;
        });
    return Promise.all(p);
}

async function connect() {
    const config: IConnectionConfig = {
        port: 9999,
        hostName: "127.0.0.1",
        db: "SUGOIJS-TEST",
        authDB: "SUGOIJS-TEST",
        user: "test",
        password: "test",
    };

    return await Dummy.setConnection(config, DummyConnection, "TESTING")
        .then(_connection => {
            connection = _connection.connectionClient;
            return setResources();
        })
        .then(() => ({connection}))

}

async function disconnect(connection) {
    console.info("Stopping server");
    expect.assertions(2);
    try {
        let disconnectRes = await Dummy.disconnect("t");
        expect(disconnectRes).toBe(null);
        disconnectRes = await Dummy.disconnect();
        expect(disconnectRes).toBeTruthy();
    } catch (err) {
        console.error(err);
    }

}

const validationException = {type: SugoiModelException, message: "INVALID", code: 4000};
const notUpdatedException = {type: SugoiModelException, message: "Not updated", code: 5000};
const notFoundException = {type: SugoiModelException, message: "Not Found", code: 404};
const notRemovedException = {type: SugoiModelException, message: "Not removed", code: 5000};


beforeAll(async () => {
    return await connect();
});
afterAll(async () => disconnect(connection));

//Create test suit
describe("Model save test suit", () => {

    it("model should not be saved validation fail", async () => {
        expect.assertions(1);
        try {
            const dummy = await Dummy.builder("123").save()
        } catch (err) {
            (<any>expect(err)).toBeExceptionOf(validationException);

        }
    });

    it("model should be saved with lifecycle hooks apply", async () => {
        expect.assertions(1);
        const dummy = Dummy.builder("Sugoi");
        const dummyRes = await dummy.save()
            .then((saved) => {
                MockId = saved.id;
                return {name: saved.name, lastSaved: saved.lastSaved, saved: dummy.saved};
            });
        expect(dummyRes).toEqual({name: "Sugoi", lastSaved: "today", saved: true})
    });
});

//Read test suit
describe("Model read test suit", () => {

    it("beforeSave hook check", async () => {
        expect.assertions(1);
        try {
            await Dummy.findOne({name: recNamePrefix, fail: true});
        } catch (err) {
            (<any>expect(err)).toBeExceptionOf(validationException)
        }
    });

    it("Find all - check amount", async () => {
        expect.assertions(1);
        const resAmount = await Dummy.findAll({name: `${recNamePrefix}`}, QueryOptions
            .builder()
            .setSortOptions(new SortItem(SortOptions.DESC, "lastSavedTime"))
        )
            .then(res => res.length);
        expect(resAmount).toBe(recAmount);
    });

    it("Find - check amount", async () => {
        expect.assertions(1);
        const resAmount = await Dummy.find({name: `${recNamePrefix}`})
            .then(res => res.length);
        expect(resAmount).toBe(recAmount)
    });

    it("Find one", async () => {
        mockObject.found = true;
        expect.assertions(1);
        const dummyRes = await Dummy.findOne({name: `${recNamePrefix}`}, QueryOptions
            .builder()
            .setSortOptions(new SortItem(SortOptions.ASC, "lastSavedTime"))
        );
        expect(dummyRes).toEqual(mockObject);
    });

    it("Find by Id", async () => {
        expect.assertions(1);
        const dummy = await Dummy.findById(mockObject.id, QueryOptions
            .builder()
            .setSortOptions(new SortItem(SortOptions.DESC, "lastSavedTime"))
        );
        expect(dummy).toEqual(mockObject)
    });

});

//Update test suit
describe("Model update test suit", () => {

    it("update by id - validation fail", async () => {
        expect.assertions(1);
        try {
            const dummy = await Dummy.updateById<Dummy>(MockId, {name: "12"});
        } catch (err) {
            (<any>expect(err)).toBeExceptionOf(validationException);
        }

    });

    it("update by id - validation pass", async () => {
        expect.assertions(1);
        const dummy = await Dummy.updateById<any>(MockId, {name: "12", isUpdate: true})
            .then(res => Dummy.find({id: res.id}, QueryOptions.builder().setLimit(1).setOffset(0)))
            .then(res => res[0])
            .then(res => {
                if (!res) res = {};
                return {name: res.name, lastUpdated: res.lastUpdated};
            });
        expect(dummy).toEqual({name: "u_12", lastUpdated: "today"});
    });

    it("update - validation invalid Id", async () => {
        expect.assertions(1);
        try {
            const dummy = await Dummy.updateById<any>("5b8c520c875d534870ab3417", {name: "12", isUpdate: true});
        } catch (err) {
            (<any>expect(err)).toBeExceptionOf(notUpdatedException);
        }
    });

    it("update after find", async () => {
        expect.assertions(1);
        let dummy;
        const dummyRes = await Dummy.findById(MockId)
            .then(_dummy => {
                dummy = _dummy;
                dummy.name = "MyTest";
                return dummy.update()
            })
            .then(res => {
                return Dummy.findById(res.id).then(findRes=> !!findRes ? res : null)
            })
            .then(res => {
                return {name: res.name, updated: dummy.updated, lastUpdated: res.lastUpdated}
            });
        expect(dummyRes).toEqual({name: "MyTest", lastUpdated: "today", updated: true})
    });

    it("update all",async ()=>{
        const date = new Date();
        const query = {name: recNamePrefix};
        const updated = await Dummy.updateAll(query,{date},{upsert:true});
        const res = await Dummy.findAll(query);
        expect(res.every(d=>d.date && new Date(d.date).toISOString() === date.toISOString())).toBe(true);
    })

});

//Remove test suit
describe("Model remove test suit", () => {

    it("remove by id", async () => {
        expect.assertions(1);
        const dummy = await Dummy.builder("test").save()
            .then(dummy => Dummy.removeById<any>(dummy.id))
            .then(res => res.n);
        expect(dummy).toBe(1)
    });


    it("remove one - invalid Id", async () => {
        expect.assertions(1);
        const dummyRes = await Dummy.removeById<any>("5b8c520c875d5348aaaaaaaa");
        expect(dummyRes.n).toBe(0);

    });

    it("remove one - name", async () => {
        expect.assertions(1);
        const dummy = await Dummy.removeOne<any>(
            {name: recNamePrefix},
            QueryOptions.builder().setSortOptions(new SortItem(SortOptions.ASC, "lastSavedTime"))
        )
            .then(res => res.n);
        expect(dummy).toBe(1);
    });

    it("remove after find ", async () => {
        expect.assertions(1);
        const dummyRes = await Dummy.findOne({name: recNamePrefix},
            QueryOptions.builder().setSortOptions(new SortItem(SortOptions.DESC, "lastSavedTime")))
            .then(dummy => dummy.remove())
            .then(res => res.n);
        expect(dummyRes).toBe(1);

    });

    it("Remove hooks", async () => {
        expect.assertions(3);
        try {
            await Dummy.removeOne({name: recNamePrefix, fail: true});
        } catch (err) {
            (<any>expect(err)).toBeExceptionOf(validationException)
        }
        let res = await Dummy.findOne({name: recNamePrefix})
            .then(item => item.remove());
        expect(res.ok).toBe(true);
        res = await Dummy.removeOne({name: recNamePrefix});
        expect(res.ok).toBe(true);
    });

    it("remove all", async () => {
        expect.assertions(1);
        const dummy = await
            Dummy.removeAll({name: recNamePrefix})
                .then((res: any) => res.n);
        expect(dummy).toBe(recAmount - 3)

    });
});

describe("Model extra functions", () => {
    it("Not a model", () => {
        expect("getModelName" in NotModel).toBeFalsy();
        expect(NotModel instanceof ModelAbstract).toBeFalsy();
        try {
            expect(ConnectionName("test")(NotModel)).toThrowError();
        } catch (err) {
            (<any>expect(err)).toBeExceptionOf({
                type: SugoiModelException,
                message: "Class not extend ConnectableModel",
                code: 5003
            });

            try {
                expect(ModelName("test")(NotModel)).toThrowError();
            } catch (err) {
                (<any>expect(err)).toBeExceptionOf({
                    type: SugoiModelException,
                    message: "Class not extend ModelAbstract",
                    code: 5002
                });
            }


        }

    });

    it("Model name", () => {
        const originalModelName = "dummy";
        let modelName = originalModelName;
        expect(Dummy.getModelName()).toBe(modelName);
        modelName += "_updated";
        Dummy.setModelName(modelName);
        expect(Dummy.getModelName()).toBe(modelName);
        Dummy.setModelName(originalModelName);
        return;
    });

    it("Wrong config", async () => {
        expect.assertions(2);
        const connection = await Dummy.setConnection({port: null, hostName: null}, DummyConnection, "test");
        await expect(connection.isConnected()).resolves.toBeFalsy();
        await (<any>expect(Dummy.connect("fail")).rejects).toBeExceptionOf({
            type: SugoiModelException,
            message: "Connection configuration is missing",
            code: 5001
        });
    });

    it("Clone without Id", async () => {
        expect.assertions(2);
        const dummy = Dummy.clone({name: "t"});
        expect(dummy.constructor.name).toBe("Dummy");
        const dummyId = await dummy.save().then(res => res.id);
        expect(dummyId).toBeDefined()
    });

    it("Clone with Id", async () => {
        expect.assertions(2);
        const name = "test_clone";
        const d = await Dummy.builder("test").save();
        const dummy = Dummy.clone({name:name, id: d.id});
        expect(dummy.constructor.name).toBe("Dummy");
        const dummyRes = await dummy.update()
            .then(res => Dummy.findById(d.id));
        console.log(dummyRes);
        expect({name: dummy.name, id: dummy.id}).toEqual({name: dummyRes.name, id: dummyRes.id});
    });

    it("Clone without name", () => {
        const originalData = {test:true};
        const dummyClone = Dummy.clone(originalData);
        expect(dummyClone.constructor.name).toBe("Dummy");
        expect(dummyClone).toEqual(originalData);
        expect(dummyClone instanceof Dummy).toBeTruthy();
        expect("save" in dummyClone).toBeTruthy();
        expect("update" in dummyClone).toBeTruthy();
        expect("remove" in dummyClone).toBeTruthy();
    });

    it("Ignored fields", async () => {
        expect.assertions(11);
        const dummy = Dummy.builder("TestIgnore");
        dummy.addFieldsToIgnore("lastUpdated");
        expect(dummy.getIgnoredFields().indexOf("lastUpdated")).toBeGreaterThan(-1);
        let res = await dummy.save();
        expect(res.saved).toBeDefined();
        dummy.isUpdate = true;
        res = await Dummy.findById(res.id);
        expect(res.saved).not.toBeDefined();
        res = await dummy.update().then(() => Dummy.findById(res.id));
        expect(res.lastUpdated).not.toBeDefined();
        expect(res.updated).not.toBeDefined();
        expect(res.isUpdate).not.toBeDefined();

        dummy.removeFieldsFromIgnored("lastUpdated", "updated");
        expect(dummy.getIgnoredFields().indexOf("lastUpdated")).toEqual(-1);
        expect(dummy.getIgnoredFields().indexOf("updated")).toEqual(-1);

        res = await dummy.update().then(() => Dummy.findById(res.id));
        expect(res.lastUpdated).toEqual("today");
        expect(res.isUpdate).not.toBeDefined();
        expect(res.updated).toBeDefined();
    });

    it("Ignored fields init", async () => {
        expect.assertions(7);
        const dummy = Dummy.builder("TestIgnore");
        dummy.addFieldsToIgnore("lastUpdated");
        dummy.removeFieldsFromIgnored("isUpdate");
        expect(dummy.getIgnoredFields().length).toEqual(3);
        let res = await dummy.save();
        dummy.isUpdate = true;
        expect(res.saved).toBeDefined();
        res = await dummy.update().then(() => Dummy.findById(res.id));
        expect(res.lastUpdated).not.toBeDefined();
        expect(res.updated).not.toBeDefined();
        expect(res.isUpdate).toBeDefined();
        dummy.initIgnoredFields();
        res = await res.update({upsert:false}).then(() => Dummy.findById(res.id));
        expect(res.lastUpdated).toBeDefined();
        expect(res.isUpdate).not.toBeDefined();
    })

    it("Formalize value with ignored", async () => {
        expect.assertions(4);
        let res = await Dummy.builder("tester_100").save();
        expect(res.saved).toBeTruthy();
        expect(JSON.parse(JSON.stringify(res)).modelInstanceMeta).not.toBeDefined();
        const dummy = Dummy.builder("tester_100");
        res = dummy.save();
        expect(res.saved).toBeFalsy();
        expect(JSON.parse(JSON.stringify(res)).modelInstanceMeta).not.toBeDefined();

    });

    it("Formalize value without ignored", async () => {
        expect.assertions(5);
        let res = await Dummy.builder("tester_100").save();
        expect(res.saved).toBeTruthy();
        res = await res.update();
        expect(res.updated).toBeTruthy();
        expect(JSON.parse(JSON.stringify(res)).modelInstanceMeta).not.toBeDefined();
        const dummy = Dummy.builder("tester_100");

        res = dummy.save();
        expect(res.saved).not.toBeTruthy();
        expect(JSON.parse(JSON.stringify(res)).modelInstanceMeta).not.toBeDefined();
    });
});

describe("Model mandatory check", () => {
    const complexField = {data: {id: "te_123", payload: 10}};
    it("verify class level default arg mandatory fields", async () => {
        expect.assertions(2);
        let dummy = SubDummy.builder<SubDummy>("sub_dummy");
        try {
            const res = await dummy.save();
        } catch (err) {
            (<any>expect(err)).toBeExceptionOf({
                type: SugoiModelException,
                message: "INVALID",
                code: 4000,
                data: [{
                    valid: false,
                    invalidValue: undefined,
                    expectedValue: '!null && !\'\'',
                    field: 'simpleMandatoryField'
                }]
            })
        }

        dummy = dummy
            .setSimpleMandatoryField("test")
            .setStringMandatoryField("default")
            .setStringMandatoryField_2("default")
            .setComplexMandatoryField(complexField);
        let res = await dummy.save();
        delete res.saved;
        expect(res).toEqual(dummy);


    });

    it("verify class level don't allow empty string for mandatory fields", async () => {
        expect.assertions(2);
        let dummy = SubDummy.builder<SubDummy>("sub_dummy")
            .setSimpleMandatoryField("test");

        try {
            const res = await dummy.save();
        } catch (err) {
            (<any>expect(err)).toBeExceptionOf({
                type: SugoiModelException,
                message: "INVALID",
                code: 4000,
                data: [{
                    valid: false,
                    invalidValue: undefined,
                    expectedValue: '!null && !\'\'',
                    field: 'stringMandatoryField'
                }]
            })
        }

        dummy = dummy
            .setStringMandatoryField("default")
            .setStringMandatoryField_2("default")
            .setComplexMandatoryField(complexField);
        let res = await dummy.save();
        delete res.saved;
        expect(res).toEqual(dummy);
    });

    it("verify class level allow empty string for mandatory fields", async () => {
        expect.assertions(2);
        let dummy = SubDummy.builder<SubDummy>("sub_dummy")
            .setSimpleMandatoryField("test")
            .setStringMandatoryField("default");

        try {
            const res = await dummy.save();
        } catch (err) {

            (<any>expect(err)).toBeExceptionOf({
                type: SugoiModelException,
                message: "INVALID",
                code: 4000,
                data: [{
                    "valid": false,
                    "invalidValue": 1,
                    "expectedValue": {
                        "mandatory": true,
                        "arrayAllowed": false,
                        "forceArray": false,
                        "valueType": ["string"]
                    },
                    "field": "stringMandatoryField_2"
                }]
            })
        }

        dummy = dummy
            .setStringMandatoryField_2("")
            .setComplexMandatoryField(complexField);
        let res = await dummy.save();
        delete res.saved;
        expect(res).toEqual(dummy);
    });

    it("verify class level comparable object for mandatory fields", async () => {
        expect.assertions(2);
        let dummy = SubDummy.builder<SubDummy>("sub_dummy")
            .setSimpleMandatoryField("test")
            .setStringMandatoryField("default")
            .setStringMandatoryField_2("")
            .setComplexMandatoryField(Object.assign({}, complexField, {data: {id: 23}}));

        try {
            const res = await dummy.save();
        } catch (err) {
            (<any>expect(err)).toBeExceptionOf({
                type: SugoiModelException,
                message: "INVALID",
                code: 4000,
                data: [{
                    "valid": false,
                    "invalidValue": 23,

                    "expectedValue": {
                        "mandatory": true,
                        "arrayAllowed": false,
                        "forceArray": false,
                        "valueType": [{
                            "id": {
                                "mandatory": true,
                                "arrayAllowed": false,
                                "forceArray": false,
                                "valueType": ["string"]
                            },
                            "payload": {
                                "mandatory": true,
                                "arrayAllowed": false,
                                "forceArray": false,
                                "valueType": ["number"],
                                "min": 3
                            }
                        }]
                    },
                    "field": "complexMandatoryField"
                }]
            })
        }

        dummy = dummy
            .setComplexMandatoryField(complexField);
        let res = await dummy.save();
        delete res.saved;
        expect(res).toEqual(dummy);
    });

    it("skip mandatory check fields", async () => {
        expect.assertions(4);
        let res;
        let dummy = SubDummy.builder<SubDummy>("sub_dummy")
            .setSimpleMandatoryField("test")
            .setStringMandatoryField("default")
            .setStringMandatoryField_2("")
            .setComplexMandatoryField(Object.assign({}, complexField, {data: {id: 23}}));

        try {
            res = await dummy.save();
        } catch (err) {
            (<any>expect(err)).toBeExceptionOf({
                type: SugoiModelException,
                message: "INVALID",
                code: 4000,
                data: [{
                    "valid": false,
                    "invalidValue": 23,
                    "expectedValue": {
                        "mandatory": true,
                        "arrayAllowed": false,
                        "forceArray": false,
                        "valueType": [{
                            "id": {
                                "mandatory": true,
                                "arrayAllowed": false,
                                "forceArray": false,
                                "valueType": ["string"]
                            },
                            "payload": {
                                "mandatory": true,
                                "arrayAllowed": false,
                                "forceArray": false,
                                "valueType": ["number"],
                                "min": 3
                            }
                        }]
                    },
                    "field": "complexMandatoryField"
                }]
            })
        }

        dummy.skipRequiredFieldsValidation(true);
        res = await dummy.save();
        delete res.saved;
        expect(res).toEqual(dummy);

        try {
            res = await SubDummy.updateById(dummy.id,{name:"testing"});
        } catch (err) {
            (<any>expect(err)).toBeExceptionOf({
                type: SugoiModelException,
                message: "INVALID",
                code: 4000,
                data: [{"valid":false,"expectedValue":"!null && !''","field":"simpleMandatoryField"}]
            })
        }
        res = await SubDummy.updateById(dummy.id,{stringMandatoryField_2:"",name:"testing"},QueryOptions.builder().setSkipRequiredValidation(true));
        dummy.name = "testing";
        delete res.lastUpdated;
        delete res.updated;
        expect(res).toEqual(dummy)

    });

    it("add mandatory fields", () => {
        const d1 = SubDummy.builder("1");
        const d2 = SubDummy.builder("2");
        d1.addMandatoryField("test", true);
        expect(d1.getMandatoryFields()).not.toEqual(d2.getMandatoryFields());
        d1.removeMandatoryFields("test");
        expect(d1.getMandatoryFields()).toEqual(d2.getMandatoryFields());
    });



    it("remove mandatory fields", () => {
        const d1 = SubDummy.builder("1");
        const d2 = SubDummy.builder("2");
        d1.removeMandatoryFields("complexMandatoryField");
        expect(d1.getMandatoryFields()).not.toEqual(d2.getMandatoryFields());
        d2.removeMandatoryFields("complexMandatoryField");
        expect(d1.getMandatoryFields()).toEqual(d2.getMandatoryFields());
    })
});