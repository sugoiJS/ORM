"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const dummy_1 = require("./models/dummy");
const not_model_1 = require("./models/not-model");
const model_abstract_1 = require("../models/model.abstract");
const dummy_connection_class_1 = require("./classes/dummy-connection.class");
const connection_name_decorator_1 = require("../decorators/connection-name.decorator");
const model_name_decorator_1 = require("../decorators/model-name.decorator");
const sub_dummy_1 = require("./models/sub-dummy");
const exceptionCheck = {
    toBeExceptionOf(received, expected) {
        const type = expected.type;
        const message = expected.message;
        const code = expected.code;
        const data = expected.data;
        const isInstance = received instanceof type;
        if (!isInstance) {
            return {
                pass: false,
                message: () => `expected ${received.name} not of type ${type.nanme}`,
            };
        }
        if (received.message !== message) {
            return {
                pass: false,
                message: () => `expected ${message} got ${received.message}`,
            };
        }
        if (received.code !== code) {
            return {
                pass: false,
                message: () => `expected ${code} got ${received.code}`,
            };
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
        };
    }
};
expect.extend(exceptionCheck);
const recAmount = 10;
const recNamePrefix = "read_name_";
let mockObject, MockId, connection;
function setResources() {
    return __awaiter(this, void 0, void 0, function* () {
        const p = [];
        for (let i = 0; i < recAmount; i++) {
            const dummy = dummy_1.Dummy.builder(`${recNamePrefix}${i}`);
            p.push(dummy.save());
        }
        Promise.race(p)
            .then(first => {
            delete first.saved;
            mockObject = first;
        });
        return Promise.all(p);
    });
}
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        const config = {
            port: 9999,
            hostName: "127.0.0.1",
            db: "SUGOIJS-TEST",
            authDB: "SUGOIJS-TEST",
            user: "test",
            password: "test",
        };
        return yield dummy_1.Dummy.setConnection(config, dummy_connection_class_1.DummyConnection, "TESTING")
            .then(_connection => {
            connection = _connection.connectionClient;
            return setResources();
        })
            .then(() => ({ connection }));
    });
}
function disconnect(connection) {
    return __awaiter(this, void 0, void 0, function* () {
        console.info("Stopping server");
        expect.assertions(2);
        try {
            let disconnectRes = yield dummy_1.Dummy.disconnect("t");
            expect(disconnectRes).toBe(null);
            disconnectRes = yield dummy_1.Dummy.disconnect();
            expect(disconnectRes).toBeTruthy();
        }
        catch (err) {
            console.error(err);
        }
    });
}
const validationException = { type: index_1.SugoiModelException, message: "INVALID", code: 4000 };
const notUpdatedException = { type: index_1.SugoiModelException, message: "Not updated", code: 5000 };
const notFoundException = { type: index_1.SugoiModelException, message: "Not Found", code: 404 };
const notRemovedException = { type: index_1.SugoiModelException, message: "Not removed", code: 5000 };
beforeAll(() => __awaiter(this, void 0, void 0, function* () {
    return yield connect();
}));
afterAll(() => __awaiter(this, void 0, void 0, function* () { return disconnect(connection); }));
//Create test suit
describe("Model save test suit", () => {
    it("model should not be saved validation fail", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(1);
        try {
            const dummy = yield dummy_1.Dummy.builder("123").save();
        }
        catch (err) {
            expect(err).toBeExceptionOf(validationException);
        }
    }));
    it("model should be saved with lifecycle hooks apply", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(1);
        const dummy = dummy_1.Dummy.builder("Sugoi");
        const dummyRes = yield dummy.save()
            .then((saved) => {
            MockId = saved.id;
            return { name: saved.name, lastSaved: saved.lastSaved, saved: dummy.saved };
        });
        expect(dummyRes).toEqual({ name: "Sugoi", lastSaved: "today", saved: true });
    }));
});
//Read test suit
describe("Model read test suit", () => {
    it("beforeSave hook check", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(1);
        try {
            yield dummy_1.Dummy.findOne({ name: recNamePrefix, fail: true });
        }
        catch (err) {
            expect(err).toBeExceptionOf(validationException);
        }
    }));
    it("Find all - check amount", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(1);
        const resAmount = yield dummy_1.Dummy.findAll({ name: `${recNamePrefix}` }, index_1.QueryOptions
            .builder()
            .setSortOption(new index_1.SortItem(index_1.SortOptions.DESC, "lastSavedTime")))
            .then(res => res.length);
        expect(resAmount).toBe(recAmount);
    }));
    it("Find - check amount", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(1);
        const resAmount = yield dummy_1.Dummy.find({ name: `${recNamePrefix}` })
            .then(res => res.length);
        expect(resAmount).toBe(recAmount);
    }));
    it("Find one", () => __awaiter(this, void 0, void 0, function* () {
        mockObject.found = true;
        expect.assertions(1);
        const dummyRes = yield dummy_1.Dummy.findOne({ name: `${recNamePrefix}` }, index_1.QueryOptions
            .builder()
            .setSortOptions(new index_1.SortItem(index_1.SortOptions.ASC, "lastSavedTime")));
        expect(dummyRes).toEqual(mockObject);
    }));
    it("Find by Id", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(1);
        const dummy = yield dummy_1.Dummy.findById(mockObject.id, index_1.QueryOptions
            .builder()
            .setSortOptions(new index_1.SortItem(index_1.SortOptions.DESC, "lastSavedTime")));
        expect(dummy).toEqual(mockObject);
    }));
});
//Update test suit
describe("Model update test suit", () => {
    it("update by id - validation fail", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(1);
        try {
            const dummy = yield dummy_1.Dummy.updateById(MockId, { name: "12" });
        }
        catch (err) {
            expect(err).toBeExceptionOf(validationException);
        }
    }));
    it("update by id - validation pass", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(1);
        const dummy = yield dummy_1.Dummy.updateById(MockId, { name: "12", isUpdate: true })
            .then(res => dummy_1.Dummy.find({ id: MockId }, index_1.QueryOptions.builder().setLimit(1).setOffset(0)))
            .then(res => res[0])
            .then(res => {
            if (!res)
                res = {};
            return { name: res.name, lastUpdated: res.lastUpdated };
        });
        expect(dummy).toEqual({ name: "u_12", lastUpdated: "today" });
    }));
    it("update - validation invalid Id", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(1);
        try {
            const dummy = yield dummy_1.Dummy.updateById("5b8c520c875d534870ab3417", { name: "12", isUpdate: true });
        }
        catch (err) {
            expect(err).toBeExceptionOf(notUpdatedException);
        }
    }));
    it("update after find ", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(1);
        let dummy;
        const dummyRes = yield dummy_1.Dummy.findById(MockId)
            .then(_dummy => {
            dummy = _dummy;
            dummy.name = "MyTest";
            return dummy.update();
        })
            .then(_ => dummy_1.Dummy.findById(dummy.id))
            .then(res => {
            return { name: res.name, updated: dummy.updated, lastUpdated: res.lastUpdated };
        });
        expect(dummyRes).toEqual({ name: "MyTest", lastUpdated: "today", updated: true });
    }));
    // it("update all",async ()=>{
    //     Dummy.updateAll
    //
    // })
});
//Remove test suit
describe("Model remove test suit", () => {
    it("remove by id", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(1);
        const dummy = yield dummy_1.Dummy.builder("test").save()
            .then(dummy => dummy_1.Dummy.removeById(dummy.id))
            .then(res => res.n);
        expect(dummy).toBe(1);
    }));
    it("remove one - invalid Id", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(1);
        const dummyRes = yield dummy_1.Dummy.removeById("5b8c520c875d5348aaaaaaaa");
        expect(dummyRes.n).toBe(0);
    }));
    it("remove one - name", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(1);
        const dummy = yield dummy_1.Dummy.removeOne({ name: recNamePrefix }, index_1.QueryOptions.builder().setSortOptions(new index_1.SortItem(index_1.SortOptions.ASC, "lastSavedTime")))
            .then(res => res.n);
        expect(dummy).toBe(1);
    }));
    it("remove after find ", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(1);
        const dummyRes = yield dummy_1.Dummy.findOne({ name: recNamePrefix }, index_1.QueryOptions.builder().setSortOptions(new index_1.SortItem(index_1.SortOptions.DESC, "lastSavedTime")))
            .then(dummy => dummy.remove())
            .then(res => res.n);
        expect(dummyRes).toBe(1);
    }));
    it("Remove hooks", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(3);
        try {
            yield dummy_1.Dummy.removeOne({ name: recNamePrefix, fail: true });
        }
        catch (err) {
            expect(err).toBeExceptionOf(validationException);
        }
        let res = yield dummy_1.Dummy.findOne({ name: recNamePrefix })
            .then(item => item.remove());
        expect(res.ok).toBe(true);
        res = yield dummy_1.Dummy.removeOne({ name: recNamePrefix });
        expect(res.ok).toBe(true);
    }));
    it("remove all", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(1);
        const dummy = yield dummy_1.Dummy.removeAll({ name: recNamePrefix })
            .then((res) => res.n);
        expect(dummy).toBe(recAmount - 3);
    }));
});
describe("Model extra functions", () => {
    it("Not a model", () => {
        expect("getModelName" in not_model_1.NotModel).toBeFalsy();
        expect(not_model_1.NotModel instanceof model_abstract_1.ModelAbstract).toBeFalsy();
        try {
            expect(connection_name_decorator_1.ConnectionName("test")(not_model_1.NotModel)).toThrowError();
        }
        catch (err) {
            expect(err).toBeExceptionOf({
                type: index_1.SugoiModelException,
                message: "Class not extend ConnectableModel",
                code: 5003
            });
            try {
                expect(model_name_decorator_1.ModelName("test")(not_model_1.NotModel)).toThrowError();
            }
            catch (err) {
                expect(err).toBeExceptionOf({
                    type: index_1.SugoiModelException,
                    message: "Class not extend ModelAbstract",
                    code: 5002
                });
            }
        }
    });
    it("Model name", () => {
        const originalModelName = "dummy";
        let modelName = originalModelName;
        expect(dummy_1.Dummy.getModelName()).toBe(modelName);
        modelName += "_updated";
        dummy_1.Dummy.setModelName(modelName);
        expect(dummy_1.Dummy.getModelName()).toBe(modelName);
        dummy_1.Dummy.setModelName(originalModelName);
        return;
    });
    it("Wrong config", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(2);
        const connection = yield dummy_1.Dummy.setConnection({ port: null, hostName: null }, dummy_connection_class_1.DummyConnection, "test");
        yield expect(connection.isConnected()).resolves.toBeFalsy();
        yield expect(dummy_1.Dummy.connect("fail")).rejects.toBeExceptionOf({
            type: index_1.SugoiModelException,
            message: "Connection configuration is missing",
            code: 5001
        });
    }));
    it("Clone without Id", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(2);
        const dummy = dummy_1.Dummy.clone({ name: "t" });
        expect(dummy.constructor.name).toBe("Dummy");
        const dummyId = yield dummy.save().then(res => res.id);
        expect(dummyId).toBeDefined();
    }));
    it("Clone with Id", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(2);
        const name = "test_clone";
        const d = yield dummy_1.Dummy.builder("test").save();
        const dummy = dummy_1.Dummy.clone({ name, id: d.id });
        expect(dummy.constructor.name).toBe("Dummy");
        const dummyRes = yield dummy.update()
            .then(res => dummy_1.Dummy.findById(d.id));
        expect({ name: dummyRes.name, id: dummyRes.id }).toEqual({ name: dummy.name, id: dummy.id });
    }));
    it("Ignored fields", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(11);
        const dummy = dummy_1.Dummy.builder("TestIgnore");
        dummy.addFieldsToIgnore("lastUpdated");
        expect(dummy.getIgnoredFields().indexOf("lastUpdated")).toBeGreaterThan(-1);
        let res = yield dummy.save();
        expect(res.saved).toBeDefined();
        dummy.isUpdate = true;
        res = yield dummy_1.Dummy.findById(res.id);
        expect(res.saved).not.toBeDefined();
        res = yield dummy.update().then(() => dummy_1.Dummy.findById(res.id));
        expect(res.lastUpdated).not.toBeDefined();
        expect(res.updated).not.toBeDefined();
        expect(res.isUpdate).not.toBeDefined();
        dummy.removeFieldsFromIgnored("lastUpdated", "updated");
        expect(dummy.getIgnoredFields().indexOf("lastUpdated")).toEqual(-1);
        expect(dummy.getIgnoredFields().indexOf("updated")).toEqual(-1);
        res = yield dummy.update().then(() => dummy_1.Dummy.findById(res.id));
        expect(res.lastUpdated).toEqual("today");
        expect(res.isUpdate).not.toBeDefined();
        expect(res.updated).toBeDefined();
    }));
    it("Ignored fields init", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(7);
        const dummy = dummy_1.Dummy.builder("TestIgnore");
        dummy.addFieldsToIgnore("lastUpdated");
        dummy.removeFieldsFromIgnored("isUpdate");
        expect(dummy.getIgnoredFields().length).toEqual(3);
        let res = yield dummy.save();
        dummy.isUpdate = true;
        expect(res.saved).toBeDefined();
        res = yield dummy.update().then(() => dummy_1.Dummy.findById(res.id));
        expect(res.lastUpdated).not.toBeDefined();
        expect(res.updated).not.toBeDefined();
        expect(res.isUpdate).toBeDefined();
        dummy.initIgnoredFields();
        res = yield res.update().then(() => dummy_1.Dummy.findById(res.id));
        expect(res.lastUpdated).toBeDefined();
        expect(res.isUpdate).not.toBeDefined();
    }));
    it("Formalize value with ignored", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(4);
        let res = yield dummy_1.Dummy.builder("tester_100").save();
        expect(res.saved).toBeTruthy();
        expect(JSON.parse(JSON.stringify(res)).modelInstanceMeta).not.toBeDefined();
        const dummy = dummy_1.Dummy.builder("tester_100");
        res = dummy.save();
        expect(res.saved).toBeFalsy();
        expect(JSON.parse(JSON.stringify(res)).modelInstanceMeta).not.toBeDefined();
    }));
    it("Formalize value without ignored", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(5);
        let res = yield dummy_1.Dummy.builder("tester_100").save();
        expect(res.saved).toBeTruthy();
        res = yield res.update();
        expect(res.updated).toBeTruthy();
        expect(JSON.parse(JSON.stringify(res)).modelInstanceMeta).not.toBeDefined();
        const dummy = dummy_1.Dummy.builder("tester_100");
        res = dummy.save();
        expect(res.saved).not.toBeTruthy();
        expect(JSON.parse(JSON.stringify(res)).modelInstanceMeta).not.toBeDefined();
    }));
});
describe("Model mandatory check", () => {
    const complexField = { data: { id: "te_123", payload: 10 } };
    it("verify class level default arg mandatory fields", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(2);
        let dummy = sub_dummy_1.SubDummy.builder("sub_dummy");
        try {
            const res = yield dummy.save();
        }
        catch (err) {
            expect(err).toBeExceptionOf({
                type: index_1.SugoiModelException,
                message: "INVALID",
                code: 4000,
                data: [{
                        valid: false,
                        invalidValue: undefined,
                        expectedValue: '!null && !\'\'',
                        field: 'simpleMandatoryField'
                    }]
            });
        }
        dummy = dummy
            .setSimpleMandatoryField("test")
            .setStringMandatoryField("default")
            .setStringMandatoryField_2("default")
            .setComplexMandatoryField(complexField);
        let res = yield dummy.save();
        delete res.saved;
        expect(res).toEqual(dummy);
    }));
    it("verify class level don't allow empty string for mandatory fields", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(2);
        let dummy = sub_dummy_1.SubDummy.builder("sub_dummy")
            .setSimpleMandatoryField("test");
        try {
            const res = yield dummy.save();
        }
        catch (err) {
            expect(err).toBeExceptionOf({
                type: index_1.SugoiModelException,
                message: "INVALID",
                code: 4000,
                data: [{
                        valid: false,
                        invalidValue: undefined,
                        expectedValue: '!null && !\'\'',
                        field: 'stringMandatoryField'
                    }]
            });
        }
        dummy = dummy
            .setStringMandatoryField("default")
            .setStringMandatoryField_2("default")
            .setComplexMandatoryField(complexField);
        let res = yield dummy.save();
        delete res.saved;
        expect(res).toEqual(dummy);
    }));
    it("verify class level allow empty string for mandatory fields", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(2);
        let dummy = sub_dummy_1.SubDummy.builder("sub_dummy")
            .setSimpleMandatoryField("test")
            .setStringMandatoryField("default");
        try {
            const res = yield dummy.save();
        }
        catch (err) {
            expect(err).toBeExceptionOf({
                type: index_1.SugoiModelException,
                message: "INVALID",
                code: 4000,
                data: [{
                        valid: false,
                        expectedValue: '!null',
                        field: 'stringMandatoryField_2'
                    }]
            });
        }
        dummy = dummy
            .setStringMandatoryField_2("")
            .setComplexMandatoryField(complexField);
        let res = yield dummy.save();
        delete res.saved;
        expect(res).toEqual(dummy);
    }));
    it("verify class level comparable object for mandatory fields", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(2);
        let dummy = sub_dummy_1.SubDummy.builder("sub_dummy")
            .setSimpleMandatoryField("test")
            .setStringMandatoryField("default")
            .setStringMandatoryField_2("")
            .setComplexMandatoryField(Object.assign({}, complexField, { data: { id: 23 } }));
        try {
            const res = yield dummy.save();
        }
        catch (err) {
            expect(err).toBeExceptionOf({
                type: index_1.SugoiModelException,
                message: "INVALID",
                code: 4000,
                data: [{
                        "valid": false,
                        "invalidValue": { "id": 23 },
                        "expectedValue": {
                            "mandatory": true,
                            "arrayAllowed": false,
                            "valueType": {
                                "id": { "mandatory": true, "arrayAllowed": false, "valueType": "string" },
                                "payload": { "mandatory": true, "arrayAllowed": false, "valueType": "number", "min": 3 }
                            }
                        },
                        "field": "complexMandatoryField"
                    }]
            });
        }
        dummy = dummy
            .setComplexMandatoryField(complexField);
        let res = yield dummy.save();
        delete res.saved;
        expect(res).toEqual(dummy);
    }));
    it("skip mandatory check fields", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(2);
        let dummy = sub_dummy_1.SubDummy.builder("sub_dummy")
            .setSimpleMandatoryField("test")
            .setStringMandatoryField("default")
            .setStringMandatoryField_2("")
            .setComplexMandatoryField(Object.assign({}, complexField, { data: { id: 23 } }));
        try {
            const res = yield dummy.save();
        }
        catch (err) {
            expect(err).toBeExceptionOf({
                type: index_1.SugoiModelException,
                message: "INVALID",
                code: 4000,
                data: [{
                        "valid": false,
                        "invalidValue": { "id": 23 },
                        "expectedValue": {
                            "mandatory": true,
                            "arrayAllowed": false,
                            "valueType": {
                                "id": { "mandatory": true, "arrayAllowed": false, "valueType": "string" },
                                "payload": { "mandatory": true, "arrayAllowed": false, "valueType": "number", "min": 3 }
                            }
                        },
                        "field": "complexMandatoryField"
                    }]
            });
        }
        dummy.skipRequiredFieldsValidation(true);
        let res = yield dummy.save();
        delete res.saved;
        expect(res).toEqual(dummy);
    }));
    it("add mandatory fields", () => {
        const d1 = sub_dummy_1.SubDummy.builder("1");
        const d2 = sub_dummy_1.SubDummy.builder("2");
        d1.addMandatoryField("test", true);
        expect(d1.getMandatoryFields()).not.toEqual(d2.getMandatoryFields());
        d1.removeMandatoryFields("test", true);
        expect(d1.getMandatoryFields()).toEqual(d2.getMandatoryFields());
    });
    it("remove mandatory fields", () => {
        const d1 = sub_dummy_1.SubDummy.builder("1");
        const d2 = sub_dummy_1.SubDummy.builder("2");
        d1.removeMandatoryFields("complexMandatoryField");
        expect(d1.getMandatoryFields()).not.toEqual(d2.getMandatoryFields());
        d2.removeMandatoryFields("complexMandatoryField");
        expect(d1.getMandatoryFields()).toEqual(d2.getMandatoryFields());
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL19fdGVzdHNfXy9tb2RlbC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxvQ0FBcUc7QUFDckcsMENBQXFDO0FBQ3JDLGtEQUE0QztBQUM1Qyw2REFBdUQ7QUFDdkQsNkVBQWlFO0FBQ2pFLHVGQUF1RTtBQUN2RSw2RUFBNkQ7QUFDN0Qsa0RBQTRDO0FBRTVDLE1BQU0sY0FBYyxHQUFHO0lBQ25CLGVBQWUsQ0FBQyxRQUFRLEVBQUUsUUFBb0U7UUFDMUYsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztRQUMzQixNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDO1FBQ2pDLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUM7UUFDM0IsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztRQUMzQixNQUFNLFVBQVUsR0FBRyxRQUFRLFlBQVksSUFBSSxDQUFDO1FBQzVDLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDYixPQUFPO2dCQUNILElBQUksRUFBRSxLQUFLO2dCQUNYLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxZQUFZLFFBQVEsQ0FBQyxJQUFJLGdCQUFnQixJQUFJLENBQUMsS0FBSyxFQUFFO2FBQ3ZFLENBQUE7U0FDSjtRQUVELElBQUksUUFBUSxDQUFDLE9BQU8sS0FBSyxPQUFPLEVBQUU7WUFDOUIsT0FBTztnQkFDSCxJQUFJLEVBQUUsS0FBSztnQkFDWCxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsWUFBWSxPQUFPLFFBQVEsUUFBUSxDQUFDLE9BQU8sRUFBRTthQUMvRCxDQUFBO1NBQ0o7UUFFRCxJQUFJLFFBQVEsQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFO1lBQ3hCLE9BQU87Z0JBQ0gsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLFlB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