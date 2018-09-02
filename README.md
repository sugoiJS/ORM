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

#### Model interface

##### Find

> (static method) findAll(query: any = {}, options?: QueryOptions) - query all records

> (static method) findOne(query: any = {}, options:QueryOptions ={limit:1}) - query one record

> (static method) findById(id: string | number, options:QueryOptions ={limit:1}) - query by id

> (static method) find(query: any = {}, options?: QueryOptions) - customize query

##### Remove

> (static method) removeAll(query: any = {}, options?: QueryOptions) - remove all records

> (static method) removeOne(query: any = {}, options:QueryOptions ={limit:1}) - remove one record

> (static method) removeById(id: string | number, options:QueryOptions ={limit:1}) - remove by id

> (instance method) remove(query: any = {}, options?: QueryOptions) - remove the record itself

##### Save (create)

> (instance method) save(query: any = {}, options?: QueryOptions) - Save instance to DB\Microservice

##### Update

> (instance method) update(options?: QueryOptions) - Update instance on DB\Microservice

##### Setting the model name

By default the model name is the name of the class (case sensitive).

For changing the model name use:

1. Class static method setModelName(name:string):

        Post.setModelName("posts");

2. @ModelName(name:string) decorator:

        @ModelName("posts")
        export class Post extends ModelAbstract{
        }

#### Lifecycle Hooks

SugoiJS ORM uses predefined lifecycle hooks that can be implemented by interfaces:

1. IBeforeValidate
2. IValidate
3. IBeforeSave \ IBeforeUpdate
4. IAfterSave \ IAfterUpdate

![SugoiJS Lifecycle hooks](https://www.sugoijs.com/assets/lifecycle.png)

## Documentation

You can find further information on [Sugoi official website](http://www.sugoijs.com)