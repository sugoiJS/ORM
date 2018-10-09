import {
    addIgnoredFields,
    getIgnoredFields,
    removeFieldsFromIgnored,
    initInstanceIgnoredFields, Ignore
} from "../decorators/ignore.decorator";

export class Storeable {

    private static ModelMeta: {[prop:string]: any} = {};
    protected modelInstanceMeta: {[prop:string]: any} = {};

    constructor() {
        this.flagMetaAsIgnored()
    }

    public flagMetaAsIgnored() {
        this.flagAsIgnored('modelInstanceMeta', true);
    }

    private flagAsIgnored(field: string, ignored: boolean) {
        const descriptor = Object.getOwnPropertyDescriptor(this, field);
        if (!descriptor) return;
        descriptor.enumerable = !ignored;
        descriptor.configurable = true;
        Object.defineProperty(this, field, descriptor);
    }

    public static setModelMeta(key: string, value: any) {
        this.ModelMeta[key] = value;
    }

    public setModelMeta(key: string, value: any) {
        this.modelInstanceMeta[key] =  value;
    }

    public static getModelMeta<T=any>(key: string): T {
        return this.ModelMeta[key] as T;
    }

    public getModelMeta<T=any>(key: string): T {
        return this.modelInstanceMeta[key] as T;
    }

    public static hasModelMeta(key: string): boolean {
        return this.ModelMeta.hasOwnProperty(key);
    }

    public hasModelMeta(key: string): boolean {
        return this.modelInstanceMeta.hasOwnProperty(key)
    }

    public static deleteModelMeta(key: string) {
        delete this.ModelMeta[key];
    }

    public deleteModelMeta(key: string) {
        delete this.modelInstanceMeta[key];
    }

    public addFieldsToIgnore(...fields: string[]) {
        addIgnoredFields(this, ...fields);
    }

    public removeFieldsFromIgnored(...fields: string[]) {
        removeFieldsFromIgnored(this, ...fields);
    }


    public initIgnoredFields() {
        initInstanceIgnoredFields(this);
    }

    public getIgnoredFields() {
        return getIgnoredFields(this);
    }


    public hideIgnoredFields(): void {
        const ignoredFields = this.getIgnoredFields();
        ignoredFields.forEach(field => {
            this.flagAsIgnored(field, true);
        });
    }

    protected revertIgnoredFields(): void {
        const ignoredFields = this.getIgnoredFields();
        ignoredFields.forEach(field => {
            if (field === "modelInstanceMeta") return;
            this.flagAsIgnored(field, false);
        });
    }
}