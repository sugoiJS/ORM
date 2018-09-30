import {IConnectionConfig, QueryOptions, SugoiModelException, SortItem, SortOptions} from "../index";
import {Dummy} from "./models/dummy";

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

export const exceptionCheck = {
    toBeExceptionOf(received, expected: { type: any, message: string, code: number }) {
        const type = expected.type;
        const message = expected.message;
        const code = expected.code;
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

        return {
            pass: true,
            message: () => `expected equal to what got`,
        }


    }
};
expect.extend(exceptionCheck);

export const recAmount = 10;
export const recNamePrefix = "read_name_";
export let mockObject;

export async function setResources() {
    const p = [];
    for (let i = 0; i < recAmount; i++) {
        p.push(
            Dummy.builder(`${recNamePrefix}${i}`).save()
        );
    }
    Promise.race(p).then(first => {
        mockObject = first;
    });
    return Promise.all(p);
}

let mongod;
let MockId;
const validationException = {type: SugoiModelException, message: "INVALID", code: 4000};
const notFoundException = {type: SugoiModelException, message: "Not Found", code: 404};
const notUpdatedException = {type: SugoiModelException, message: "Not updated", code: 5000};
const notRemovedException = {type: SugoiModelException, message: "Not removed", code: 5000};

let client, connection;


beforeAll(async () => {
    // const res = await connect();
    // client = res.client;
    // mongod = res.mongod;
    // connection = res.connection;
    return await setResources();
});
// afterAll(async () => disconnect(client, mongod, connection));


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

    it("beforeSave hook check",async () => {
        expect.assertions(1);
        try {
            await Dummy.findOne({name: recNamePrefix,fail:true});
        }catch (err){
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
            .then(res => Dummy.find({id: MockId}, QueryOptions.builder().setLimit(1).setOffset(0)))
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

    it("update after find ", async () => {
        expect.assertions(1);
        let dummy;
        const dummyRes = await Dummy.findById(MockId)
            .then(_dummy => {
                dummy = _dummy;
                dummy.name = "MyTest";
                return dummy.update()
            })
            .then(_ => Dummy.findById(dummy.id))
            .then(res => {
                return {name: res.name, updated: dummy.updated, lastUpdated: res.lastUpdated}
            });
        expect(dummyRes).toEqual({name: "MyTest", lastUpdated: "today", updated: true})
    });

    // it("update all",async ()=>{})

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
            {name:  recNamePrefix},
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

    it("Remove hooks", async () =>{
        expect.assertions(3);
        try {
            await Dummy.removeOne({name: recNamePrefix,fail:true});
        }catch (err){
            (<any>expect(err)).toBeExceptionOf(validationException)
        }
        let res = await Dummy.findOne({name: recNamePrefix})
            .then(item=>item.remove());
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
        const dummy = Dummy.clone({name, id: d.id});
        expect(dummy.constructor.name).toBe("Dummy");
        const dummyRes = await dummy.update()
            .then(res => Dummy.findById(d.id));
        expect({name: dummyRes.name, id: dummyRes.id}).toEqual({name: dummy.name, id: dummy.id});
    });

});