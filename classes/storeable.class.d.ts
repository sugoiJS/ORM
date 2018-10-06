export declare class Storeable {
    static readonly IGNORED_FIELDS_OBJECT_KEY = "IGNORED_FIELDS_OBJECT";
    private static ModelMeta;
    private modelInstanceMeta;
    constructor();
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
    protected removeIgnoredFields(): any;
    protected revertIgnoredFields(key: string, value?: any): any;
}
