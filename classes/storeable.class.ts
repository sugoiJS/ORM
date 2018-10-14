import {
    addIgnoredFields,
    getIgnoredFields,
    removeFieldsFromIgnored,
    initInstanceIgnoredFields
} from "../decorators/ignore.decorator";
import {DECORATOR_KEYS} from "../constants/decorators-key.constant";
import {TComparableSchema} from "@sugoi/core";
import {addInstanceMandatoryField, getMandatoryFields} from "../decorators/mandatory.decorator";

export class Storeable {

    private static ModelMeta: { [prop: string]: any } = {};
    protected modelInstanceMeta: { [prop: string]: any } = {};

    constructor() {
        this.flagMetaAsIgnored();
        this.hideIgnoredFields();
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
        this.modelInstanceMeta[key] = value;
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
        fields.forEach(field => this.flagAsIgnored(field, true));
    }

    public removeFieldsFromIgnored(...fields: string[]) {
        removeFieldsFromIgnored(this, ...fields);
        fields.forEach(field => this.flagAsIgnored(field, false));
    }


    public initIgnoredFields() {
        this.showIgnoredFields();
        initInstanceIgnoredFields(this);
        this.hideIgnoredFields();
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

    protected showIgnoredFields(): void {
        const ignoredFields = this.getIgnoredFields();
        ignoredFields.forEach(field => {
            if (field === "modelInstanceMeta") return;
            this.flagAsIgnored(field, false);
        });
    }

    public getMandatoryFields() {
        const fields = Object.assign({}, this.getInstanceMandatoryFields(), getMandatoryFields(this));
        Array.from(this.getIgnoreMandatoryFields())
            .forEach(field => {
                delete fields[field];
            });
        return fields;
    }

    public getInstanceMandatoryFields() {
        return this.getModelMeta(DECORATOR_KEYS.MANDATORY_KEY) || {};
    }


    public addMandatoryField(field: string, condition?: TComparableSchema);
    public addMandatoryField(field: string, allowEmptyString?: boolean);
    public addMandatoryField(field: string, condition?: boolean | TComparableSchema) {
        addInstanceMandatoryField(this, field, condition);
    }

    private getIgnoreMandatoryFields():Set<string> {
        return this.getModelMeta(DECORATOR_KEYS.IGNORE_MANDATORY_KEY) || new Set();
    }

    private setIgnoreMandatoryFields(fields: Set<string>) {
        this.setModelMeta(DECORATOR_KEYS.IGNORE_MANDATORY_KEY, fields);
    }

    public removeMandatoryFields(...fields) {
        const instanceFields = this.getInstanceMandatoryFields();
        const classFields = [];
        fields.forEach(field => {
            if (!instanceFields.hasOwnProperty(field)) {
                classFields.push(field);
                return;
            } else {
                delete instanceFields[field];
            }
        });
        if (classFields.length > 0) {
            const classIgnoreMandatory = this.getIgnoreMandatoryFields();
            classFields.forEach(field => classIgnoreMandatory.add(field));
            this.setIgnoreMandatoryFields(classIgnoreMandatory);
        }
    }

}