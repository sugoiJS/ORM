# @Sugoi\orm

![Sugoi logo](http://www.sugoijs.com/assets/logo_inverse.png)

[![npm version](https://badge.fury.io/js/%40sugoi%2Form.svg)](https://badge.fury.io/js/%40sugoi%2Form)
[![Build Status](https://travis-ci.org/sugoiJS/ORM.svg?branch=master)](https://travis-ci.org/sugoiJS/ORM)
[![codecov](https://codecov.io/gh/sugoiJS/ORM/branch/master/graph/badge.svg)](https://codecov.io/gh/sugoiJS/ORM)

## Introduction
SugoiJS is a minimal modular framework,

which gives you the ability to use only what you need, fast.

this is a standalone module that can be functional separately (as all of the SugoiJS modules).

The ORM module provide the ability to build model classes with lifecycle hooks.

## Installation

> npm install --save @sugoi/orm

### tsconfig.json:

Under your tsconfig - compilerOptions set:

- `"target": "es2015"`

- `"emitDecoratorMetadata": true`

- `"experimentalDecorators": true`

- `"lib": ["es2015","dom"]`


#### Template

You are able to use the config template which was set for the @sugoi/demo application:

    {
      "compilerOptions": {
        "baseUrl": "./src",
        "allowJs": true,
        "target": "es2015",
        "module": "commonjs",
        "moduleResolution": "node",
        "sourceMap": true,
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        "lib": [
          "es2015",
          "dom"
        ],
        "typeRoots": [
          "./node_modules/@types"
        ],
        "types": [
          "body-parser",
          "express",
          "node"
        ]
      }
    }


## ORM

The ORM Models are of two types:

### 1. Connectable Model

Models of this type have direct connection to the storage unit.

Its most common usage is for TCP connection.

#### Setting connection

Example (by the @sugoi/mongodb package implementation):

##### First Step - Set connection item

Connection item is the class which contains all of the communication establishing/closing logic.

Another role of this class is to reflect the connection current status.

This class must implement the IConnection interface!

    import {CONNECTION_STATUS, IConnection} from "@sugoi/orm";
    import {Db, MongoClient} from "mongodb";
    import {IMongoConnectionConfig} from "../interfaces/mongo-connection-config.interface";


    export class MongoConnection implements IConnection, IMongoConnectionConfig {
        protocol: string = `mongodb://`;
        port: number = 27017;
        hostName: string;
        status: CONNECTION_STATUS;
        connectionClient: {
            dbInstance: Db,
            client: MongoClient
        };
        db?: string;
        connectionName?: string;
        user?: string;
        password?: string;
        authDB?: string;
        public newParser: boolean = false;


        connect(): Promise<boolean> {
            const connectionConfig = {
                authSource: this.authDB || this.db
            };
            if (this.user && this.password) {
                connectionConfig['auth'] = {
                    user: this.user,
                    password: this.password
                };
            }
            if (this.shouldUseNewParser()) {
                connectionConfig['useNewUrlParser'] = true;
            }

            return MongoClient.connect(this.getConnectionString(), connectionConfig)
                .then((client: MongoClient) => {
                    client.on("error", () => this.disconnect());
                    this.connectionClient = {
                        dbInstance: client.db(this.db),
                        client
                    };
                    return true
                })
                .catch(err => {
                    console.error(err);
                    throw err;
                });
        }


        isConnected(): Promise<boolean> {
            return Promise.resolve(this.status === CONNECTION_STATUS.CONNECTED);
        }


        public shouldUseNewParser(): boolean {
            return this.newParser;
        }

        public disconnect() {
            if (!this.connectionClient)
                return Promise.resolve(false);
            else {
                return this.connectionClient.client.close(true)
                    .then((disconnectObject) => {
                        this.status = CONNECTION_STATUS.DISCONNECTED
                        return true;
                    });
            }

        }

        public getConnectionString() {
            let connString = this.protocol;
            if (this.user && this.password) {
                connString += `${this.user}:${this.password}@`;
            }
            connString += `${this.hostName}:${this.port}`;
            return connString;
        }
    }

##### Second Step - Setup the connection by config

Setting a connection done by the ConnectableModel `setConnection` static function:

`public static setConnection(configData: IConnectionConfig,connectionClass:, connectionName: string = "default"): Promise<IConnectionConfig>`



    MongoModel.setConnection({
        port: 27017,
        protocol: "mongodb://",
        hostName: "127.0.0.1",
        db: "SUGOIJS-EXAMPLE",
        newParser: true
    },MongoConnection,"SUGOIJS-EXAMPLE-CONNECTION")

This method will create a connection item and store it for later use.

Also, the connect method will get called.

#### Setting connectable model connection name

By default connectable model use connection which label by name "default" (case sensitive).

For changing the connection name use:

1. Class static method setModelName(name:string):

        Post.setConnectionName("adminDB");

2. @ConnectionName(name:string) decorator:

        @ConnectionName("adminDB")
        export class Post extends ModelAbstract{
        }

### 2. RESTFUL Model

Models of this type don't have direct connection to the storage unit.

The communication is done by a single request. The connection closes as soon as the request is completed.

Common usage is restful requests.

Example:

    export class MicroServiceModel extends ModelAbstract{

        constructor(){
            super();
        }

    }


### CRUD Implementation

For CRUD support, you can implement your CRUD logic under each of the CRUD emitters:

#### 1. saveEmitter

    public saveEmitter(options?:QueryOptions): Promise<any> {
            return rp({
                method: 'POST',
                uri: 'https://api.example.com/myendpoint',
                body:this,
                json: true
            })
    }



#### 2. findEmitter

    protected static findEmitter(query: any, options?:QueryOptions): Promise<any> {
            return rp({
                method: 'GET',
                uri: 'https://api.example.com/myendpoint',
                qs:query,
                json: true
            })
    }




#### 3. updateEmitter

    public updateEmitter(options?:QueryOptions): Promise<any> {
            return rp({
                method: 'PUT',
                uri: `https://api.example.com/myendpoint/${this.id}`,
                body:this,
                json: true
            })
    }



#### 4. removeEmitter

    protected static removeEmitter(query?,options?:QueryOptions):Promise<any> {
            return rp({
                method: 'DELETE',
                uri: `https://api.example.com/myendpoint/${query.id}`,
                body: this,
                json: true
            })
    }

### QueryOptions

QueryOptions is an object which provides the query meta-data like sort, offset and limit.

QueryOptions class contains a `builder` method for easy "inline" usage.

#### Properties

> limit:number - The maximum records amount to query. default - 0.

> offset:number - The amount of record which should be skipped, can also be use for page number. default - 0.

> sort:Array<SortItem> - Array of all the sorted fields and their direction

    SortItem{
        sortOption: SortOptions;// "DESC" | "ASC"
        field: string;
    }

#### Usage example

    public static pagingQuery(query:any,limit:number,page:number){
        DataModel.findAll(query, QueryOptions.builder()
                            .setLimit(limit)
                            .setOffset(page)
                            .setSortOption(
                                new SortItem(SortOptions.DESC, "amount"),
                                new SortItem(SortOptions.ASC, "lastUpdate")
                            )
                        );
    }

### Model interface

#### Find

> (static method) findAll(query: any = {}, options?: QueryOptions) - query all records

> (static method) findOne(query: any = {}, options:QueryOptions ={limit:1}) - query one record

> (static method) findById(id: string | number, options:QueryOptions ={limit:1}) - query by id

> (static method) find(query: any = {}, options?: QueryOptions) - customize query

#### Remove

> (static method) removeAll(query: any = {}, options?: QueryOptions) - remove all records

> (static method) removeOne(query: any = {}, options:QueryOptions ={limit:1}) - remove one record

> (static method) removeById(id: string | number, options:QueryOptions ={limit:1}) - remove by id

> (instance method) remove(query: any = {}, options?: QueryOptions) - remove the record itself

#### Save (create)

> (instance method) save(options?: QueryOptions) - Save instance to DB\Microservice

#### Update

> (static method) updateById(id: string | number,, options:QueryOptions ={limit:1}) - update by id

> (instance method) update(options?: QueryOptions) - Update instance on DB\Microservice

### Setting the model name

By default the model name is the name of the class (case sensitive).

For changing the model name use:

1. Class static method setModelName(name:string):

        Post.setModelName("posts");

2. @ModelName(name:string) decorator:

        @ModelName("posts")
        export class Post extends ModelAbstract{
        }

### Primary key

For query and upsert data @sugoi use primary key of the instance\query object.

This primary key is property which decorated with @Primary()

Using the Primary key will done by:

1. (Utility function) `getPrimaryKey(classToUse)`

 Return the primary key name from given class, if not found null will return.


2. (static method) `castIdToQuery(id:string,classToUse = this)`

 Will return an object with property name which decorate with Primary as key and the id as value

 `classToUse` - class to get the primary key from (default is `this`)


3. (static method) `getIdFromQuery(query: any,classToUse = this, deleteProperty:boolean = true)`

 If query contain the primary key the function will return the query primary key value.

 `classToUse` - class to get the primary key from (default is `this`)

 `deleteProperty` - delete primary key property from the query (default is `true`)

4. (instance method) `getIdQuery():{[prop:string]:string}`

 Return key value object of primary key and its value of the current instance

 if no primary key set the function will return null;


 Full example:

    export class Post extends ModelAbstract{
        @Primary()
        public postId:string = "post-12";

        public static getPostById(id:string): Promise<Post>{
            return this.find(this.castIdToQuery(id));
        }

        public getCurrentPost(): Promise<Post>{
            const query = getIdQuery(); // query = {postId:"post-12"}
            return Post.find(query);
        }

        public getPrimaryKeyName(): string{
            return getPrimaryKey(this);// result is "postId"
        }

    }


All of the @sugoi/orm predefined interface methods which mentioned before use the Primary key.

#### Lifecycle Hooks

SugoiJS ORM uses predefined lifecycle hooks that can be implemented by interfaces:

##### Save(create) and update

1. IBeforeValidate
2. IValidate
3. IBeforeSave \ IBeforeUpdate
4. IAfterSave \ IAfterUpdate

![SugoiJS Lifecycle hooks create and update](https://www.sugoijs.com/assets/lifecycle.png)

##### Find and remove

3. IBeforeFind \ IBeforeRemove
4. IAfterFind \ IAfterRemove

![SugoiJS Lifecycle hooks find and remove](https://www.sugoijs.com/assets/lifecycle_RD.png)


## Documentation

You can find further information on [Sugoi official website](http://www.sugoijs.com)
