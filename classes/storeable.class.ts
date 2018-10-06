import {addIgnoredFields, getIgnoredFields, removeFieldsFromIgnored,initInstanceIgnoredFields} from "../decorators/ignore.decorator";
import {StringUtils} from "@sugoi/core/dist/policies/utils/string.util";

export class Storeable{
    public static readonly IGNORED_FIELDS_OBJECT_KEY = "IGNORED_FIELDS_OBJECT";
    private static ModelMeta:Map<string,any> = new Map();
    private modelInstanceMeta:Map<string,any> = new Map();

    constructor(){
    }

    public static setModelMeta(key: string, value: any) {
        this.ModelMeta.set(key, value);
    }

    public setModelMeta(key: string, value: any) {
        this.modelInstanceMeta.set(key, value);
    }

    public static getModelMeta<T=any>(key: string): T {
        return this.ModelMeta.get(key) as T;
    }

    public getModelMeta<T=any>(key: string): T {
        return this.modelInstanceMeta.get(key) as T;
    }

    public static hasModelMeta(key: string): boolean {
        return this.ModelMeta.has(key);
    }

    public hasModelMeta(key: string): boolean {
        return this.modelInstanceMeta.has(key)
    }

    public static deleteModelMeta(key: string) {
        this.ModelMeta.delete(key);
    }

    public deleteModelMeta(key: string) {
        this.modelInstanceMeta.delete(key);
    }

    public addFieldsToIgnore(...fields:string[]){
        addIgnoredFields(this,...fields);
    }

    public removeFieldsFromIgnored(...fields:string[]){
        removeFieldsFromIgnored(this,...fields);
    }


    public initIgnoredFields(){
        initInstanceIgnoredFields(this);
    }

    public getIgnoredFields(){
        return getIgnoredFields(this);
    }

    protected removeIgnoredFields():any{
        const key = StringUtils.generateGuid();
        const ignoredFields = this.getIgnoredFields();
        const metaObject = {};
        ignoredFields.forEach(field=>{
            if(!this.hasOwnProperty(field)) return;
            metaObject[field] = this[field];
            delete this[field];
        });
        (<typeof Storeable>this.constructor).setModelMeta(Storeable.IGNORED_FIELDS_OBJECT_KEY+"_"+key,metaObject);
        return key;
    }

    protected revertIgnoredFields(key:string,value?:any):any{
        const metaObject = (<typeof Storeable>this.constructor).getModelMeta(Storeable.IGNORED_FIELDS_OBJECT_KEY+"_"+key);
        Object.assign(this,metaObject,value);
        return this;
    }
}
addIgnoredFields(Storeable,"modelInstanceMeta");