import { CONNECTION_STATUS } from "../index";
import { IModel } from "../interfaces/model.interface";
import { TIdentifierTypes } from "../interfaces/identifer-types.type";
import { QueryOptions } from "../classes/query-options.class";
export declare abstract class ModelAbstract implements IModel {
    static status: CONNECTION_STATUS;
    private static collectionName;
    constructor();
    static setModelName(name?: string): void;
    static setCollectionName(name?: string): void;
    static getModelName(): string;
    static getCollectionName(): string;
    static find<T = any>(query?: any, options?: Partial<QueryOptions> & any): Promise<Array<T>>;
    static findOne<T = any>(query?: any, options?: Partial<QueryOptions> & any): Promise<T>;
    static findAll<T = any>(query?: any, options?: Partial<QueryOptions> & any): Promise<T[]>;
    static findById<T = any>(id: TIdentifierTypes, options?: Partial<QueryOptions> & any): Promise<T>;
    protected static findEmitter<T = any>(query: any, options?: Partial<QueryOptions> & any): Promise<T>;
    save<T = any>(options?: Partial<QueryOptions> & any): Promise<T>;
    protected abstract saveEmitter<T = any>(options?: Partial<QueryOptions> & any): Promise<T>;
    protected sugBeforeValidate(): Promise<void>;
    sugValidate(): Promise<string | boolean>;
    protected sugBeforeSave(): Promise<void>;
    protected sugAfterSave(): Promise<void>;
    update<T = any>(options?: Partial<QueryOptions> & any): Promise<T>;
    protected abstract updateEmitter<T = any>(options?: Partial<QueryOptions> & any): Promise<T>;
    sugBeforeUpdate(): Promise<void>;
    sugAfterUpdate(): Promise<void>;
    remove<T = any>(query?: any, options?: Partial<QueryOptions> & any): Promise<T>;
    static removeById<T = any>(id: string, options?: Partial<QueryOptions> & any): Promise<T>;
    static removeOne<T = any>(query?: any, options?: Partial<QueryOptions> & any): Promise<T>;
    static removeAll<T = any>(query?: any, options?: Partial<QueryOptions> & any): Promise<T[]>;
    protected static removeEmitter<T = any>(query?: any, options?: Partial<QueryOptions> & any): Promise<T>;
    /**
     * Transform data into class(T) instance
     * @param classIns - class instance
     * @param data - data to transform
     * @returns {T}
     */
    static clone<T>(classIns: any, data: any): T;
    /**
     * In case string is passed this function build query object using the class primary key
     * @param {string | any} query
     * @param {any} classToUse - class to take the primary key from
     * @returns {{[prop:string}:TIdentifierTypes}
     */
    static castIdToQuery(query: string | any, classToUse?: typeof ModelAbstract): any;
    /**
     * Check if the primary key found in the query and return his value
     *
     * @param query - The query object
     * @param {any} classToUse - class to take the primary key from
     * @param {boolean} deleteProperty - flag to remove the primaryKey property from the query
     * @returns {TIdentifierTypes}
     */
    static getIdFromQuery(query: any, classToUse?: typeof ModelAbstract, deleteProperty?: boolean): TIdentifierTypes;
    /**
     * build and return query object containing the primary key and his value
     * @returns {{[primaryKey]:TIdentifierTypes}}
     */
    getIdQuery(): {
        [x: string]: any;
    };
}
