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
const exceptionCheck = {
    toBeExceptionOf(received, expected) {
        const type = expected.type;
        const message = expected.message;
        const code = expected.code;
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
        return {
            pass: true,
            message: () => `expected equal to what got`,
        };
    }
};
expect.extend(exceptionCheck);
const recAmount = 10;
const recNamePrefix = "read_name_";
let mockObject;
let connection;
function setResources() {
    return __awaiter(this, void 0, void 0, function* () {
        const p = [];
        for (let i = 0; i < recAmount; i++) {
            const dummy = dummy_1.Dummy.builder(`${recNamePrefix}${i}`);
            dummy.hideIgnoredFields();
            p.push(dummy.save());
        }
        Promise.race(p).then(first => {
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
let MockId;
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
    // it("update all",async ()=>{})
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
        dummy.hideIgnoredFields();
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
        dummy.hideIgnoredFields();
        res = dummy.save();
        expect(res.saved).not.toBeTruthy();
        expect(JSON.parse(JSON.stringify(res)).modelInstanceMeta).not.toBeDefined();
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL19fdGVzdHNfXy9tb2RlbC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxvQ0FBcUc7QUFDckcsMENBQXFDO0FBQ3JDLGtEQUE0QztBQUM1Qyw2REFBdUQ7QUFDdkQsNkVBQWlFO0FBQ2pFLHVGQUF1RTtBQUN2RSw2RUFBNkQ7QUFFN0QsTUFBTSxjQUFjLEdBQUc7SUFDbkIsZUFBZSxDQUFDLFFBQVEsRUFBRSxRQUFzRDtRQUM1RSxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQzNCLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUM7UUFDakMsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztRQUMzQixNQUFNLFVBQVUsR0FBRyxRQUFRLFlBQVksSUFBSSxDQUFDO1FBQzVDLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDYixPQUFPO2dCQUNILElBQUksRUFBRSxLQUFLO2dCQUNYLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxZQUFZLFFBQVEsQ0FBQyxJQUFJLGdCQUFnQixJQUFJLENBQUMsS0FBSyxFQUFFO2FBQ3ZFLENBQUE7U0FDSjtRQUVELElBQUksUUFBUSxDQUFDLE9BQU8sS0FBSyxPQUFPLEVBQUU7WUFDOUIsT0FBTztnQkFDSCxJQUFJLEVBQUUsS0FBSztnQkFDWCxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsWUFBWSxPQUFPLFFBQVEsUUFBUSxDQUFDLE9BQU8sRUFBRTthQUMvRCxDQUFBO1NBQ0o7UUFFRCxJQUFJLFFBQVEsQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFO1lBQ3hCLE9BQU87Z0JBQ0gsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLFlBQVksSUFBSSxRQUFRLFFBQVEsQ0FBQyxJQUFJLEVBQUU7YUFDekQsQ0FBQTtTQUNKO1FBRUQs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