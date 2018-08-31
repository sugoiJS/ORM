import {CONNECTION_STATUS, SugoiModelException, EXCEPTIONS} from "../index";
import {IModel} from "../interfaces/model.interface";
import {getPrimaryKey, Primary} from "../decorators/primary.decorator";
import {TIdentifierTypes} from "../interfaces/identifer-types.type";


export abstract class ModelAbstract implements IModel {
    public static status: CONNECTION_STATUS;

    @Primary()
    public id: TIdentifierTypes;

    private static collectionName: string;


    constructor() {
    }

    public static setCollectionName(name:string = this.constructor['name']){
        this.collectionName = name;
    }

    public static getCollectionName(){
        return this.collectionName || this.constructor['name'];
    }

    public static find<T=any>(query: any = {}, options?: any): Promise<Array<T>> {
        const that = this;
        return that.findEmitter(query, options)
            .then((res: Array<T>) => {
                if(!Array.isArray(res))res = [res];
                res = res.map((collection) => {
                    return that.clone(that, collection);
                });
                return res;
            });

    }

    public static findOne<T=any>(query: any = {}, options: any={}): Promise<T> {
        options.limit = 1;
        return this.find<T>(query, options)
            .then(res => res ? res[0] : null);
    }

    public static findAll<T=any>(query: any = {}, options?: any): Promise<T[]> {
        return this.find<T>(query, options)
            .then(res => res ? res : null);
    }

    public static findById<T=any>(id: TIdentifierTypes, options?: any): Promise<T> {
        return this.findOne<T>(this.castIdToQuery(id), options)
    }

    protected static findEmitter<T=any>(query: any, options?: any): Promise<T> {
        throw new SugoiModelException(EXCEPTIONS.NOT_IMPLEMENTED.message, EXCEPTIONS.NOT_IMPLEMENTED.code, "Find Emitter " + this.constructor.name);
    };

    public async save<T=any>(options: any | string = {}): Promise<T> {
        let savedData;
        return await this.sugBeforeValidate()
            .then(() => {
                return this.sugValidate();
            })
            .then((valid) => {
                if (valid !== true)
                    throw new SugoiModelException(EXCEPTIONS.INVALID.message, EXCEPTIONS.INVALID.code, valid);
            })
            .then(() => this.sugBeforeSave())
            .then(() => this.saveEmitter(options))
            .then((_savedData) => {
                savedData = _savedData;
                return this.sugAfterSave();
            })
            .then(() => {
                return savedData;
            })
    }

    protected abstract saveEmitter<T=any>(options?): Promise<T>;

    protected sugBeforeValidate(): Promise<void> {
        return 'beforeValidate' in (this as any)
            ? (<any>this).beforeValidate() || Promise.resolve()
            : Promise.resolve();
    }

    public sugValidate(): Promise<string | boolean> {
        return 'validate' in (this as any)
            ? (<any>this).validate().then(valid => (valid === undefined) ? true : !!valid)
            : Promise.resolve(true);
    };

    protected sugBeforeSave(): Promise<void> {
        return "beforeSave" in (this as any)
            ? (<any>this).beforeSave() || Promise.resolve()
            : Promise.resolve();
    };

    protected sugAfterSave(): Promise<void> {
        return 'afterSave' in (this as any)
            ? (<any>this).afterSave() || Promise.resolve()
            : Promise.resolve();
    };

    public async update<T=any>(options: any = {}): Promise<T> {
        let updatedData;
        return await this.sugBeforeValidate()
            .then(() => {
                return this.sugValidate();
            })
            .then((valid) => {
                if (valid !== true)
                    throw new SugoiModelException(EXCEPTIONS.INVALID.message, EXCEPTIONS.INVALID.code, valid);
            })
            .then(() => this.sugBeforeUpdate())
            .then(() => this.updateEmitter(options))
            .then((_updatedData) => {
                updatedData = _updatedData;
                return this.sugAfterUpdate();
            })
            .then(() => {
                return updatedData;
            });
    }

    protected abstract updateEmitter<T=any>(options?: any): Promise<T>;

    public sugBeforeUpdate(): Promise<void> {
        return 'beforeUpdate' in (this as any)
            ? (<any>this).beforeUpdate() || Promise.resolve()
            : Promise.resolve();
    };

    public sugAfterUpdate(): Promise<void> {
        return 'afterUpdate' in (this as any)
            ? (<any>this).afterUpdate() || Promise.resolve()
            : Promise.resolve();
    };

    public remove<T=any>(query: any = this.getIdQuery(),options?:any): Promise<T> {
        return ModelAbstract.removeEmitter(query,options);
    }

    protected static removeById<T=any>(id: string,options?:any): Promise<T>  {
        return this.removeOne(this.castIdToQuery(id),options);
    }

    protected static removeOne<T=any>(query:any = {},options:any={}): Promise<T> {
        options.limit = 1;
        return this.removeEmitter(query);
    }

    protected static removeAll<T=any>(query:any = {},options?:any): Promise<T[]>  {
        return this.removeEmitter(query,options);
    }

    protected static removeEmitter<T=any>(query?: any,options?:any): Promise<T> {
        throw new SugoiModelException(EXCEPTIONS.NOT_IMPLEMENTED.message, EXCEPTIONS.NOT_IMPLEMENTED.code, "Remove Emitter " + this.constructor.name);
    };

    /**
     * Transform data into class(T) instance
     * @param classIns - class instance
     * @param data - data to transform
     * @returns {T}
     */
    public static clone<T>(classIns: any, data: any): T {
        const func = function () {
        };
        func.prototype = classIns.prototype;
        const temp = new func();
        classIns.apply(temp, []);
        temp.constructor = classIns;
        Object.assign(temp, data);
        return temp as T;
    }

    /**
     * In case string is passed this function build query object using the class primary key
     * @param {string | any} query
     * @returns {any}
     */
    protected static castIdToQuery(query: string | any) {
        if (typeof query === "string") {
            const primaryKey = getPrimaryKey(this);
            query = {[primaryKey]: query};
        }
        return query
    }

    /**
     * Check if the primary key found in the query and return his value
     *
     * @param query - The query object
     * @param {boolean} deleteProperty - flag to remove the primaryKey property from the query
     * @returns {TIdentifierTypes}
     */
    protected static getIdFromQuery(query: any,deleteProperty=true):TIdentifierTypes {
        const primaryKey = getPrimaryKey(this);
        const id = query && query.hasOwnProperty(primaryKey) ? query[primaryKey] : null;
        if(deleteProperty) {
            delete query[primaryKey];
        }
        return id;
    }

    /**
     * build and return query object containing the primary key and his value
     * @returns {{[primaryKey]:TIdentifierTypes}}
     */
    public getIdQuery(){
        const primaryKey = getPrimaryKey(this);
        return {[primaryKey]:this[primaryKey]};
    }

}