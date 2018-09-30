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
// export async function connect() {
//     let client, connection;
//     const config: IConnectionConfig = {
//         port: 27017,
//         protocol: "mongodb://",
//         hostName: "127.0.0.1",
//         db: "SUGOIJS-TEST",
//         user: null,
//         password: null,
//         newParser: true
//     };
//     const mongod = new MongodbMemoryServer({
//         instance: {
//             port: config.port,
//             ip: config.hostName,
//             dbName: config.db,
//         }
//     });
//     return await mongod.getConnectionString().then(connString => {
//         console.info(connString);
//     })
//         .then(() => MongoModel.setConnection(config, "TESTING"))
//         .then(_connection => {
//             client = _connection.client;
//             connection = _connection.connection;
//             return setResources();
//         })
//         .then(() => ({client, mongod, connection}))
//
// }
// export async function disconnect(client, mongod, connection) {
//     console.info("Stopping server");
//     expect.assertions(2);
//     try {
//         let disconnectRes = await Dummy.disconnect("t");
//         expect(disconnectRes).toEqual(null);
//         disconnectRes = await Dummy.disconnect();
//         //corrupt disconnect
//         delete connection.getConnection().client;
//         disconnectRes = await connection.disconnect();
//         expect(disconnectRes).toEqual(null);
//     }catch (err){
//         console.error(err);
//     }
//     return await mongod.stop();
// }
exports.exceptionCheck = {
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
expect.extend(exports.exceptionCheck);
exports.recAmount = 10;
exports.recNamePrefix = "read_name_";
function setResources() {
    return __awaiter(this, void 0, void 0, function* () {
        const p = [];
        for (let i = 0; i < exports.recAmount; i++) {
            p.push(dummy_1.Dummy.builder(`${exports.recNamePrefix}${i}`).save());
        }
        Promise.race(p).then(first => {
            exports.mockObject = first;
        });
        return Promise.all(p);
    });
}
exports.setResources = setResources;
let mongod;
let MockId;
const validationException = { type: index_1.SugoiModelException, message: "INVALID", code: 4000 };
const notFoundException = { type: index_1.SugoiModelException, message: "Not Found", code: 404 };
const notUpdatedException = { type: index_1.SugoiModelException, message: "Not updated", code: 5000 };
const notRemovedException = { type: index_1.SugoiModelException, message: "Not removed", code: 5000 };
let client, connection;
beforeAll(() => __awaiter(this, void 0, void 0, function* () {
    // const res = await connect();
    // client = res.client;
    // mongod = res.mongod;
    // connection = res.connection;
    return yield setResources();
}));
// afterAll(async () => disconnect(client, mongod, connection));
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
            yield dummy_1.Dummy.findOne({ name: exports.recNamePrefix, fail: true });
        }
        catch (err) {
            expect(err).toBeExceptionOf(validationException);
        }
    }));
    it("Find all - check amount", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(1);
        const resAmount = yield dummy_1.Dummy.findAll({ name: `${exports.recNamePrefix}` }, index_1.QueryOptions
            .builder()
            .setSortOptions(new index_1.SortItem(index_1.SortOptions.DESC, "lastSavedTime")))
            .then(res => res.length);
        expect(resAmount).toBe(exports.recAmount);
    }));
    it("Find - check amount", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(1);
        const resAmount = yield dummy_1.Dummy.find({ name: `${exports.recNamePrefix}` })
            .then(res => res.length);
        expect(resAmount).toBe(exports.recAmount);
    }));
    it("Find one", () => __awaiter(this, void 0, void 0, function* () {
        exports.mockObject.found = true;
        expect.assertions(1);
        const dummyRes = yield dummy_1.Dummy.findOne({ name: `${exports.recNamePrefix}` }, index_1.QueryOptions
            .builder()
            .setSortOptions(new index_1.SortItem(index_1.SortOptions.ASC, "lastSavedTime")));
        expect(dummyRes).toEqual(exports.mockObject);
    }));
    it("Find by Id", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(1);
        const dummy = yield dummy_1.Dummy.findById(exports.mockObject.id, index_1.QueryOptions
            .builder()
            .setSortOptions(new index_1.SortItem(index_1.SortOptions.DESC, "lastSavedTime")));
        expect(dummy).toEqual(exports.mockObject);
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
        const dummy = yield dummy_1.Dummy.removeOne({ name: exports.recNamePrefix }, index_1.QueryOptions.builder().setSortOptions(new index_1.SortItem(index_1.SortOptions.ASC, "lastSavedTime")))
            .then(res => res.n);
        expect(dummy).toBe(1);
    }));
    it("remove after find ", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(1);
        const dummyRes = yield dummy_1.Dummy.findOne({ name: exports.recNamePrefix }, index_1.QueryOptions.builder().setSortOptions(new index_1.SortItem(index_1.SortOptions.DESC, "lastSavedTime")))
            .then(dummy => dummy.remove())
            .then(res => res.n);
        expect(dummyRes).toBe(1);
    }));
    it("Remove hooks", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(3);
        try {
            yield dummy_1.Dummy.removeOne({ name: exports.recNamePrefix, fail: true });
        }
        catch (err) {
            expect(err).toBeExceptionOf(validationException);
        }
        let res = yield dummy_1.Dummy.findOne({ name: exports.recNamePrefix })
            .then(item => item.remove());
        expect(res.ok).toBe(true);
        res = yield dummy_1.Dummy.removeOne({ name: exports.recNamePrefix });
        expect(res.ok).toBe(true);
    }));
    it("remove all", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(1);
        const dummy = yield dummy_1.Dummy.removeAll({ name: exports.recNamePrefix })
            .then((res) => res.n);
        expect(dummy).toBe(exports.recAmount - 3);
    }));
});
describe("Model extra functions", () => {
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
});
