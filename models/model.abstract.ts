import {CONNECTION_STATUS, SugoiModelException, EXCEPTIONS} from "../index";


export abstract class ModelAbstract {
    public static status: CONNECTION_STATUS;

    public id: string;

    protected collectionName: string = this.constructor['name'] as string;

    constructor() {

    }

    public static find<T=any>(query: any = {}, options: any = {}): Promise<Array<T>> {
        const that = this;
        query = ModelAbstract.castStringQuery(query);
        return that.findEmitter(query, options)
            .then((res: Array<T>) => {
                res = res.map((collection) => {
                    return that.clone(that, collection);
                });
                return res;
            });

    }


    public static findOne<T=any>(query: any = {}, options: any = {}): Promise<T> {
        options.limit = 1;
        return this.find<T>(query, options)
            .then(res => res ? res[0] : null);
    }

    protected static findEmitter(query: any, options?: any): Promise<any> {
        throw new SugoiModelException(EXCEPTIONS.NOT_IMPLEMENTED.message, EXCEPTIONS.NOT_IMPLEMENTED.code, "Find Emitter " + this.constructor.name);
    };

    public async save(options: any | string = {}): Promise<any> {
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

    protected abstract saveEmitter(options?): Promise<any>;

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
            ? (<any>this).beforeSave()|| Promise.resolve()
            : Promise.resolve();
    };
    protected sugAfterSave(): Promise<void> {
        return 'afterSave' in (this as any)
            ? (<any>this).afterSave()|| Promise.resolve()
            : Promise.resolve();
    };

    public async update(options: any | string = {}): Promise<any> {
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

    protected abstract updateEmitter(options?): Promise<any>;

    public sugBeforeUpdate(): Promise<void> {
        return 'beforeUpdate' in (this as any)
            ? (<any>this).beforeUpdate()|| Promise.resolve()
            : Promise.resolve();
    };

    public sugAfterUpdate(): Promise<void> {
        return 'afterUpdate' in (this as any)
            ? (<any>this).afterUpdate() || Promise.resolve()
            : Promise.resolve();
    };

    protected abstract removeEmitter(query?: any): Promise<any>;

    public remove(query?: any): Promise<any> {
        return this.removeEmitter(query);
    }

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

    protected static castStringQuery(query: string | any) {
        if (typeof query === "string") {
            query = {id: query};
        }
        return query
    }
}