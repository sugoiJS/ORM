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
            .setSortOptions(new index_1.SortItem(index_1.SortOptions.DESC, "lastSavedTime")))
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
            .then(res => dummy_1.Dummy.find({ id: res.id }, index_1.QueryOptions.builder().setLimit(1).setOffset(0)))
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
    it("update after find", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(1);
        let dummy;
        const dummyRes = yield dummy_1.Dummy.findById(MockId)
            .then(_dummy => {
            dummy = _dummy;
            dummy.name = "MyTest";
            return dummy.update();
        })
            .then(res => {
            return dummy_1.Dummy.findById(res.id).then(findRes => !!findRes ? res : null);
        })
            .then(res => {
            return { name: res.name, updated: dummy.updated, lastUpdated: res.lastUpdated };
        });
        expect(dummyRes).toEqual({ name: "MyTest", lastUpdated: "today", updated: true });
    }));
    it("update all", () => __awaiter(this, void 0, void 0, function* () {
        const date = new Date();
        const query = { name: recNamePrefix };
        const updated = yield dummy_1.Dummy.updateAll(query, { date }, { upsert: true });
        const res = yield dummy_1.Dummy.findAll(query);
        expect(res.every(d => d.date && new Date(d.date).toISOString() === date.toISOString())).toBe(true);
    }));
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
        const dummy = dummy_1.Dummy.clone({ name: name, id: d.id });
        expect(dummy.constructor.name).toBe("Dummy");
        const dummyRes = yield dummy.update()
            .then(res => dummy_1.Dummy.findById(d.id));
        console.log(dummyRes);
        expect({ name: dummy.name, id: dummy.id }).toEqual({ name: dummyRes.name, id: dummyRes.id });
    }));
    it("Clone without name", () => {
        const originalData = { test: true };
        const dummyClone = dummy_1.Dummy.clone(originalData);
        expect(dummyClone.constructor.name).toBe("Dummy");
        expect(dummyClone).toEqual(originalData);
        expect(dummyClone instanceof dummy_1.Dummy).toBeTruthy();
        expect("save" in dummyClone).toBeTruthy();
        expect("update" in dummyClone).toBeTruthy();
        expect("remove" in dummyClone).toBeTruthy();
    });
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
        res = yield res.update({ upsert: false }).then(() => dummy_1.Dummy.findById(res.id));
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
                        "valid": false,
                        "invalidValue": 1,
                        "expectedValue": { "mandatory": true, "arrayAllowed": false, "valueType": "string" },
                        "field": "stringMandatoryField_2"
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
                        "invalidValue": 23,
                        "expectedValue": { "mandatory": true, "arrayAllowed": false, "valueType": "string" },
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
        expect.assertions(4);
        let res;
        let dummy = sub_dummy_1.SubDummy.builder("sub_dummy")
            .setSimpleMandatoryField("test")
            .setStringMandatoryField("default")
            .setStringMandatoryField_2("")
            .setComplexMandatoryField(Object.assign({}, complexField, { data: { id: 23 } }));
        try {
            res = yield dummy.save();
        }
        catch (err) {
            expect(err).toBeExceptionOf({
                type: index_1.SugoiModelException,
                message: "INVALID",
                code: 4000,
                data: [{
                        "valid": false,
                        "invalidValue": 23,
                        "expectedValue": { "mandatory": true, "arrayAllowed": false, "valueType": "string" },
                        "field": "complexMandatoryField"
                    }]
            });
        }
        dummy.skipRequiredFieldsValidation(true);
        res = yield dummy.save();
        delete res.saved;
        expect(res).toEqual(dummy);
        try {
            res = yield sub_dummy_1.SubDummy.updateById(dummy.id, { name: "testing" });
        }
        catch (err) {
            expect(err).toBeExceptionOf({
                type: index_1.SugoiModelException,
                message: "INVALID",
                code: 4000,
                data: [{ "valid": false, "expectedValue": "!null && !''", "field": "simpleMandatoryField" }]
            });
        }
        res = yield sub_dummy_1.SubDummy.updateById(dummy.id, { stringMandatoryField_2: "", name: "testing" }, index_1.QueryOptions.builder().setSkipRequiredValidation(true));
        dummy.name = "testing";
        delete res.lastUpdated;
        delete res.updated;
        expect(res).toEqual(dummy);
    }));
    it("add mandatory fields", () => {
        const d1 = sub_dummy_1.SubDummy.builder("1");
        const d2 = sub_dummy_1.SubDummy.builder("2");
        d1.addMandatoryField("test", true);
        expect(d1.getMandatoryFields()).not.toEqual(d2.getMandatoryFields());
        d1.removeMandatoryFields("test");
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
