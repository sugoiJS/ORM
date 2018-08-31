# @Sugoi\orm

![Sugoi logo](https://www.sugoijs.com/assets/logo_inverse.png)


## Introduction
SugoiJS is a minimal modular framework,

which gives you the ability to use only what you need, fast.

this is a standalone module that can be functional separately (as all of the SugoiJS modules).

The ORM module provide the ability to build model classes with lifecycle hooks.

## Installation

> npm install --save @sugoi/orm


## ORM

The ORM Models are of two types:

### 1. Connectable Model

Models of this type have direct connection to the storage unit.

Its most common usage is for TCP connection.

Example (by the @sugoi/mongodb package implementation):

    import {Connection,ConnectableModel} from "@sugoi/core";

    export class MongoModel extends ConnectableModel{
        protected static ConnectionType:Connection = MongoConnection;

        constructor() {
            super();
        }

        public static connectEmitter(connection: MongoConnection): Promise<{ dbInstance: Db, client: MongoClient }> {
                const connectionConfig = {
                    authSource: connection.authDB
                };

                return MongoClient.connect(connection.getConnectionString(), connectionConfig)
                    .then((client: MongoClient) => {
                        return {client}
                    });
            }
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

#### 1. SaveEmitter

    public saveEmitter(options?:any): Promise<any> {
            return rp({
                method: 'POST',
                uri: 'https://api.example.com/myendpoint',
                body:this,
                json: true
            })
    }



#### 2. FindEmitter

    protected static findEmitter(query: any, options = {}): Promise<any> {
            return rp({
                method: 'GET',
                uri: 'https://api.example.com/myendpoint',
                qs:query,
                json: true
            })
    }




#### 3. UpdateEmitter

    public updateEmitter(options?:any): Promise<any> {
            return rp({
                method: 'PUT',
                uri: `https://api.example.com/myendpoint/${this.id}`,
                body:this,
                json: true
            })
    }



#### 4. RemoveEmitter

    protected static removeEmitter(query?,options?): Promise<any> {
            return rp({
                method: 'DELETE',
                uri: `https://api.example.com/myendpoint/${query.id}`,
                body: this,
                json: true
            })
    }

#### Implemented Methods

##### Find

> findAll(query: any = {}, options?: any) - query all records

> findOne(query: any = {}, options:any ={limit:1}) - query one record

> findById(id: string | number, options:any ={limit:1}) - query by id

> find(query: any = {}, options?: any) - customize query

##### Remove

> removeAll(query: any = {}, options?: any) - remove all records

> removeOne(query: any = {}, options:any ={limit:1}) - remove one record

> removeById(id: string | number, options:any ={limit:1}) - remove by id

> (instance method) remove(query: any = {}, options?: any) - remove the record itself

##### Save (create)

> (instance method) save(query: any = {}, options?: any) - Save instance to DB\Microservice

##### Update

> (instance method) update(options?: any) - Update instance on DB\Microservice

#### Lifecycle Hooks

SugoiJS ORM uses predefined lifecycle hooks that can be implemented by interfaces:

1. IBeforeValidate
2. IValidate
3. IBeforeSave \ IBeforeUpdate
4. IAfterSave \ IAfterUpdate

![SugoiJS Lifecycle hooks](https://www.sugoijs.com/assets/lifecycle.png)

## Documentation

You can find further information on [Sugoi official website](http://www.sugoijs.com)