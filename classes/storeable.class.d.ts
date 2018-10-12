import { ComparableValueType } from "@sugoi/core/dist/policies/interfaces/comparable-value.interface";
export declare class Storeable {
    private static ModelMeta;
    protected modelInstanceMeta: {
        [prop: string]: any;
    };
    constructor();
    flagMetaAsIgnored(): void;
    private flagAsIgnored;
    static setModelMeta(key: string, value: any): void;
    setModelMeta(key: string, value: any): void;
    static getModelMeta<T = any>(key: string): T;
    getModelMeta<T = any>(key: string): T;
    static hasModelMeta(key: string): boolean;
    hasModelMeta(key: string): boolean;
    static deleteModelMeta(key: string): void;
    deleteModelMeta(key: string): void;
    addFieldsToIgnore(...fields: string[]): void;
    removeFieldsFromIgnored(...fields: string[]): void;
    initIgnoredFields(): void;
    getIgnoredFields(): string[];
    hideIgnoredFields(): void;
    protected showIgnoredFields(): void;
    getMandatoryFields(): any;
    getInstanceMandatoryFields(): any;
    addMandatoryField(field: string, condition?: ComparableValueType): any;
    addMandatoryField(field: string, allowEmptyString?: boolean): any;
    private getIgnoreMandatoryFields;
    private setIgnoreMandatoryFields;
    removeMandatoryFields(...fields: any[]): void;
}
