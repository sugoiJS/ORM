import {SugoiModelException, EXCEPTIONS} from "../index";
import {IModel} from "../interfaces/model.interface";
import {getPrimaryKey} from "../decorators/primary.decorator";
import {TIdentifierTypes} from "../interfaces/identifer-types.type";
import {QueryOptions} from "../classes/query-options.class";
import {clone} from "../utils/object.utils";
import {Storeable} from "../classes/storeable.class";
import {getMandatoryFields} from "../decorators/mandatory.decorator";
import {ValidateSchemaUtil} from "@sugoi/core";
import {IValidationResult} from "@sugoi/core/dist/policies/interfaces/policy-schema-validator.interface";
import {DECORATOR_KEYS} from "../constants/decorators-key.constant";


export abstract class ModelAbstract extends Storeable implements IModel {
    private static modelName: string;

    constructor() {
        super()
    }

    public static setModelName(name: string = this.name) {
        this.setCollectionName(name)
    }

    public static setCollectionName(name: string = this.name) {
        this.modelName = name;
    }

    public static getModelName() {
        return this.getCollectionName();
    }

    public static getCollectionName() {
        return this.modelName || this.name;
    }

    public static find<T=any>(query: any = {}, options?: Partial<QueryOptions | any>): Promise<Array<T>> {
        return this.findPipe(query, options);
    }

    public static findOne<T=any>(query: any = {}, options: Partial<QueryOptions | any> = QueryOptions.builder()): Promise<T> {
        options.limit = 1;
        return this.find<T>(query, options)
            .then(res => res ? res[0] : null);
    }

    public static findAll<T=any>(query: any = {}, options?: Partial<QueryOptions | any>): Promise<T[]> {
        return this.find<T>(query, options)
            .then(res => res ? res : null);
    }

    public static findById<T=any>(id: TIdentifierTypes, options?: Partial<QueryOptions | any>): Promise<T> {
        return this.findOne<T>(this.castIdToQuery(id), options)
    }

    public sugBeforeFind(query, options): Promise<void> {
        return 'beforeFind' in (this as any)
            ? (<any>this).beforeFind(query, options) || Promise.resolve()
            : Promise.resolve();
    };

    public sugAfterFind<T=any>(resolvedData: T): Promise<T> {
        return 'afterFind' in (this as any)
            ? (<any>this).afterFind(resolvedData) || Promise.resolve()
            : Promise.resolve();
    };

    protected static findPipe<T=any>(query?: any, options?: Partial<QueryOptions | any>): Promise<T[]> {
        return this.prototype.sugBeforeFind(query, options)
            .then(() => this.findEmitter(query, options))
            .then((res: Array<T>) => {
                if (!Array.isArray(res)) res = [res];
                res = res.map((collection) => {
                    return this.clone(this, collection);
                });
                return res;
            })
            .then((data) => this.prototype.sugAfterFind(data).then((res) => res || data));
    }

    protected static findEmitter<T=any>(query: any, options?: Partial<QueryOptions | any>): Promise<T> {
        throw new SugoiModelException(EXCEPTIONS.NOT_IMPLEMENTED.message, EXCEPTIONS.NOT_IMPLEMENTED.code, "Find Emitter " + this.constructor.name);
    };

    public async save<T=any>(options?: Partial<QueryOptions | any>): Promise<T> {
        return await this.sugBeforeValidate()
            .then(() => {
                return this.sugValidate();
            })
            .then((valid) => {
                if (valid !== true)
                    throw new SugoiModelException(EXCEPTIONS.INVALID.message, EXCEPTIONS.INVALID.code, valid);
            })
            .then(() => this.sugBeforeSave())
            .then(() => this.hideIgnoredFields())
            .then(() => this.saveEmitter(options))
            .then((savedData) => {
                if (typeof this !== "function")//check if is instance
                    savedData = (<any>this.constructor).clone(this.constructor, savedData);
                else
                    savedData = (<any>this).clone(this, savedData);

                Object.assign(this, savedData);
                this.flagMetaAsIgnored();
                return this;
            })
            .then((savedData: any) => {
                return this.sugAfterSave<T>(savedData).then((res) => res || savedData)
            })
    }

    protected abstract saveEmitter<T=any>(options?: Partial<QueryOptions | any>): Promise<T>;

    protected sugBeforeValidate(): Promise<void> {
        return 'beforeValidate' in (this as any)
            ? (<any>this).beforeValidate() || Promise.resolve()
            : Promise.resolve();
    }

    public sugValidate(): Promise<any | true> {
        return this.validateModel();
    };

    protected sugBeforeSave(): Promise<void> {
        return "beforeSave" in (this as any)
            ? (<any>this).beforeSave() || Promise.resolve()
            : Promise.resolve();
    };

    protected sugAfterSave<T=any>(savedData: T): Promise<T> {
        return 'afterSave' in (this as any)
            ? (<any>this).afterSave(savedData) || Promise.resolve()
            : Promise.resolve();
    };

    public async update<T=any>(options?: Partial<QueryOptions | any>): Promise<T> {
        return await this.sugBeforeValidate()
            .then(() => {
                return this.sugValidate();
            })
            .then((valid) => {
                if (valid !== true)
                    throw new SugoiModelException(EXCEPTIONS.INVALID.message, EXCEPTIONS.INVALID.code, valid);
            })
            .then(() => this.sugBeforeUpdate())
            .then(() => this.hideIgnoredFields())
            .then(() => this.updateEmitter(options))
            .then((updatedData) => {
                if (typeof this !== "function")//check if is instance
                    updatedData = (<any>this.constructor).clone(this.constructor, updatedData);
                else
                    updatedData = (<any>this).clone(this, updatedData);
                Object.assign(this, updatedData);
                this.flagMetaAsIgnored();
                return this;
            })
            .then((updatedData: any) => {
                return this.sugAfterUpdate<T>(updatedData).then((res) => res || updatedData)
            });
    }

    public static async updateById<T = any>(id: string, data: any, options?: Partial<QueryOptions | any>): Promise<T> {
        const objectInstance = this.clone(this, data) as any;
        objectInstance.setPrimaryPropertyValue(id);
        return objectInstance.update(options);
    }

    protected abstract updateEmitter<T=any>(options?: Partial<QueryOptions | any>): Promise<T>;

    public sugBeforeUpdate(): Promise<void> {
        return 'beforeUpdate' in (this as any)
            ? (<any>this).beforeUpdate() || Promise.resolve()
            : Promise.resolve();
    };

    public sugAfterUpdate<T=any>(updatedData: T): Promise<T> {
        return 'afterUpdate' in (this as any)
            ? (<any>this).afterUpdate(updatedData) || Promise.resolve()
            : Promise.resolve();
    };

    public remove<T=any>(query: any = this.getIdQuery(), options?: Partial<QueryOptions | any>): Promise<T> {
        return (<any>this.constructor).removePipe(query, options);
    }

    public static removeById<T=any>(id: string, options?: Partial<QueryOptions | any>): Promise<T> {
        return this.removeOne(this.castIdToQuery(id), options);
    }

    public static removeOne<T=any>(query: any = {}, options: Partial<QueryOptions | any> = QueryOptions.builder()): Promise<T> {
        options.limit = 1;
        return this.removePipe(query, options);
    }

    public static removeAll<T=any[]>(query: any = {}, options?: Partial<QueryOptions | any>): Promise<T> {
        return this.removePipe(query, options);
    }

    protected static removePipe<T=any>(query?: any, options?: Partial<QueryOptions | any>): Promise<T> {
        return this.prototype.sugBeforeRemove(query, options)
            .then(() => this.removeEmitter(query, options))
            .then((data) => this.prototype.sugAfterRemove(data).then(res => res || data))
    }

    protected static removeEmitter<T=any>(query?: any, options?: Partial<QueryOptions | any>): Promise<T> {
        throw new SugoiModelException(EXCEPTIONS.NOT_IMPLEMENTED.message, EXCEPTIONS.NOT_IMPLEMENTED.code, "Remove Emitter " + this.constructor.name);
    };

    public sugBeforeRemove(query, options): Promise<void> {
        return 'beforeRemove' in (this as any)
            ? (<any>this).beforeRemove(query, options) || Promise.resolve()
            : Promise.resolve();
    };

    public sugAfterRemove<T=any>(data: T): Promise<T> {
        return 'afterRemove' in (this as any)
            ? (<any>this).afterRemove(data) || Promise.resolve()
            : Promise.resolve();
    };

    /**
     * Set the value of class primary property
     *
     * @param {TIdentifierTypes} value
     */
    public setPrimaryPropertyValue(value: TIdentifierTypes): void {
        const primaryKey = getPrimaryKey(this);
        if (!primaryKey)
            throw new SugoiModelException(EXCEPTIONS.PRIMARY_NOT_CONFIGURED.message, EXCEPTIONS.PRIMARY_NOT_CONFIGURED.code, (<any>this["constructor"]).getModelName());
        this[primaryKey] = value;
    }

    public static clone<T=any>(data: any): T;
    public static clone<T=any>(classIns: any, data: any): T;

    /**
     * Transform data into class(T) instance
     * @param classIns - class instance
     * @param data - data to transform
     * @returns {T}
     */
    public static clone<T extends Storeable = any>(classIns: any, data?: any): T {
        if (arguments.length === 1) {
            data = classIns;
            classIns = this;
        }
        const instance = clone(classIns, data) as T;
        instance.flagMetaAsIgnored();
        return instance;
    }


    /**
     * In case string is passed this function build query object using the class primary key
     * @param {string | any} query
     * @param {any} classToUse - class to take the primary key from
     * @returns {{[prop:string}:TIdentifierTypes}
     */
    public static castIdToQuery(query: string | any, classToUse = this) {
        if (typeof query === "string") {
            const primaryKey = getPrimaryKey(classToUse);
            const id = query;
            query = {};
            if (primaryKey)
                query[primaryKey] = id;
        }
        return query
    }

    /**
     * Check if the primary key found in the query and return his value
     *
     * @param query - The query object
     * @param {any} classToUse - class to take the primary key from
     * @param {boolean} deleteProperty - flag to remove the primaryKey property from the query
     * @returns {TIdentifierTypes}
     */
    public static getIdFromQuery(query: any, classToUse: any = this, deleteProperty: boolean = true): TIdentifierTypes {
        const primaryKey = getPrimaryKey(classToUse);
        const id = query && query.hasOwnProperty(primaryKey) ? query[primaryKey] : null;
        if (deleteProperty) {
            delete query[primaryKey];
        }
        return id;
    }

    /**
     * build and return query object containing the primary key and his value
     * @returns {{[primaryKey]:TIdentifierTypes}}
     */
    public getIdQuery() {
        const primaryKey = getPrimaryKey(this);
        return primaryKey ? {[primaryKey]: this[primaryKey]} : null;
    }

    public validateModel(): Promise<any | true> {
        const valid = this.getModelMeta(DECORATOR_KEYS.SKIP_MANDATORY_VALIDATION)
            ? {valid: true}
            : this.validateMandatoryFields();
        if (!valid.valid) {
            return Promise.resolve(valid);
        }
        return 'validate' in (this as any)
            ? (<any>this).validate().then(valid => (valid === undefined) ? true : !!valid)
            : Promise.resolve(true);
    }

    protected validateMandatoryFields(): modelValidate {
        const result = {valid: false, invalidValue: null, expectedValue: null, field: null};
        const fields = getMandatoryFields(this);
        if (!fields) {
            result.valid = true;
            return result;
        }
        Object.keys(fields).every((field) => {
            result.field = field;
            result.invalidValue = this[field];
            if (fields[field].condition) {
                const validate = ValidateSchemaUtil.ValidateSchema(this[field], fields[field].condition);
                result.invalidValue = validate.invalidValue;
                result.expectedValue = validate.expectedValue;
                result.valid = validate.valid;
            }
            else if (fields[field].allowEmptyString) {
                result.expectedValue = "!null";
                result.valid = this[field] != null || this[field] === "";
            }
            else {
                result.expectedValue = "!null && !''";
                result.valid = this[field] != null && this[field] !== "";
            }
            return result.valid;
        });
        return result
    }

    public skipRequiredFieldsValidation(shouldSkip: boolean) {
        this.setModelMeta(DECORATOR_KEYS.SKIP_MANDATORY_VALIDATION, shouldSkip)
    }
}

interface modelValidate extends IValidationResult {
    field?: string
}
