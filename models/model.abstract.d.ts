import { IModel } from "../interfaces/model.interface";
import { TIdentifierTypes } from "../interfaces/identifer-types.type";
import { QueryOptions } from "../classes/query-options.class";
import { Storeable } from "../classes/storeable.class";
import { IValidationResult } from "@sugoi/core/dist/policies/interfaces/policy-schema-validator.interface";
export declare abstract class ModelAbstract extends Storeable implements IModel {
    private static modelName;
    constructor();
    static setModelName(name?: string): void;
    static setCollectionName(name?: string): void;
    static getModelName(): string;
    static getCollectionName(): string;
    static find<T = any>(query?: any, options?: Partial<QueryOptions | any>): Promise<Array<T>>;
    static findOne<T = any>(query?: any, options?: Partial<QueryOptions | any>): Promise<T>;
    static findAll<T = any>(query?: any, options?: Partial<QueryOptions | any>): Promise<T[]>;
    static findById<T = any>(id: TIdentifierTypes, options?: Partial<QueryOptions | any>): Promise<T>;
    sugBeforeFind(query: any, options: any): Promise<void>;
    sugAfterFind<T = any>(resolvedData: T): Promise<T>;
    protected static findPipe<T = any>(query?: any, options?: Partial<QueryOptions | any>): Promise<T[]>;
    protected static findEmitter<T = any>(query: any, options?: Partial<QueryOptions | any>): Promise<T>;
    save<T = any>(options?: Partial<QueryOptions | any>, data?: any): Promise<T>;
    protected abstract saveEmitter<T = any>(options?: Partial<QueryOptions | any>, data?: any): Promise<T>;
    protected sugBeforeValidate(options: any): Promise<void>;
    sugValidate(): Promise<any | true>;
    protected sugBeforeSave(): Promise<void>;
    protected sugAfterSave<T = any>(savedData: T): Promise<T>;
    update<T = any>(options?: Partial<QueryOptions | any>, query?: any): Promise<T>;
    static updateAll<T = any>(query: any, data: any, options?: Partial<QueryOptions | any>): Promise<T>;
    static updateById<T = any>(id: string, data: any, options?: Partial<QueryOptions | any>): Promise<T>;
    protected abstract updateEmitter<T = any>(options?: Partial<QueryOptions | any>, query?: any): Promise<T>;
    sugBeforeUpdate(): Promise<void>;
    sugAfterUpdate<T = any>(updatedData: T): Promise<T>;
    remove<T = any>(query?: any, options?: Partial<QueryOptions | any>): Promise<T>;
    static removeById<T = any>(id: string, options?: Partial<QueryOptions | any>): Promise<T>;
    static removeOne<T = any>(query?: any, options?: Partial<QueryOptions | any>): Promise<T>;
    static removeAll<T = any[]>(query?: any, options?: Partial<QueryOptions | any>): Promise<T>;
    protected static removePipe<T = any>(query?: any, options?: Partial<QueryOptions | any>): Promise<T>;
    protected static removeEmitter<T = any>(query?: any, options?: Partial<QueryOptions | any>): Promise<T>;
    sugBeforeRemove(query: any, options: any): Promise<void>;
    sugAfterRemove<T = any>(data: T): Promise<T>;
    /**
     * Set the value of class primary property
     *
     * @param {TIdentifierTypes} value
     */
    setPrimaryPropertyValue(value: TIdentifierTypes): void;
    static clone<T = any>(data: any): T;
    static clone<T = any>(data: any, applyConstructor: boolean): T;
    static clone<T = any>(classInstance: any, data: any): T;
    static clone<T = any>(classInstance: any, data: any, applyConstructor: boolean): T;
    static cast<T extends Storeable>(data: any, applyConstructor?: boolean): any;
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
    static getIdFromQuery(query: any, classToUse?: any, deleteProperty?: boolean): TIdentifierTypes;
    /**
     * build and return query object containing the primary key and his value
     * @returns {{[primaryKey]:TIdentifierTypes}}
     */
    getIdQuery(): {
        [x: string]: any;
    };
    validateModel(options: Partial<QueryOptions | any>): Promise<any | true>;
    protected validateMandatoryFields(): modelValidate;
    skipRequiredFieldsValidation(shouldSkip: boolean): void;
}
interface modelValidate extends IValidationResult {
    field?: string;
}
export {};
