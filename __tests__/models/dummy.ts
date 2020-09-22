import {
    IAfterSave,
    IAfterUpdate,
    IBeforeSave,
    IBeforeUpdate,
    IBeforeValidate,
    IValidate,
    SortItem,
    QueryOptions,
    ModelName,
    Primary,
    SugoiModelException,
    IBeforeFind,
    IAfterFind,
    IBeforeRemove,
    IAfterRemove,
    ConnectableModel,
    IConnection,
    CONNECTION_STATUS,
    Required,
    Ignore,
    ConnectionName
} from "../../index";
import {StringUtils} from "@sugoi/core/dist/policies/utils/string.util";
import {EXCEPTIONS} from "../../constants/exceptions.contant";
import {SortOptions} from "../../constants/sort-options.enum";


@ModelName("dummy")
@ConnectionName("TESTING")
export class Dummy extends ConnectableModel implements IValidate, IBeforeUpdate, IAfterUpdate, IAfterSave, IBeforeSave, IBeforeValidate, IBeforeFind, IAfterFind, IBeforeRemove, IAfterRemove {


    public static RECORDS = [];
    @Primary()
    public id;

    // @Required()
    public name;
    public lastUpdated;
    public lastSaved;
    public lastSavedTime;
    @Ignore()
    public saved: boolean;
    @Ignore()
    public updated: boolean;
    @Ignore()
    public isUpdate: boolean;

    constructor(name: string) {
        super();
        this.name = name || "default";
    }

    beforeFind(query: any, options?: Partial<QueryOptions | any>): Promise<any> | void {
        if (query.fail)
            throw new SugoiModelException(EXCEPTIONS.INVALID.message, EXCEPTIONS.INVALID.code)
        return Dummy.connect();
    }

    afterFind(res): Promise<any> | void {
        res.forEach(item => item.found = true)
    }

    beforeRemove(query: any, options?: Partial<QueryOptions | any>): Promise<any> | void {
        if (query.fail)
            throw new SugoiModelException(EXCEPTIONS.INVALID.message, EXCEPTIONS.INVALID.code)
        return Dummy.connect();
    }

    afterRemove(res): Promise<any> | void {
        res.ok = res.n > 0
    }

    protected saveEmitter(options?: any,data?:any): Promise<any> {
        return Dummy.upsert(data);
    }

    protected static findEmitter<T=Dummy>(query?: any, options: Partial<QueryOptions | any> = QueryOptions.builder()): Promise<T> {
        const limit = options.getLimit();
        const offset = options.getOffset();
        let response = Dummy.filterByQuery(query, limit, options.getSortOptions());
        return Promise.resolve(response);
    }

    protected static removeEmitter<T=any>(query?: any, options: Partial<QueryOptions | any> = QueryOptions.builder()): Promise<any> {
        const hasId = !!this.getIdFromQuery(query, this, false);
        const limit = options.limit || 0;
        const originalSize = Dummy.RECORDS.length;
        const size = originalSize - limit;
        let i = 0;
        Dummy.RECORDS = hasId || limit
            ? Dummy.filterByQuery(query, size, options.sort, hasId)
            : Dummy.RECORDS.filter(rec => {
                return !(i++ < size && Dummy.validRecordByQuery(rec, query));
            });
        const res = {n: originalSize - Dummy.RECORDS.length};
        return Promise.resolve(res);
    }

    protected async updateEmitter(options: any = {}, query: any = this.getIdQuery()): Promise<any> {
        let limit = options.limit || 100000;
        let counter = 0;
        const results = [];
        Dummy.RECORDS = Dummy.RECORDS.reduce((arr, rec) => {
            if (counter<limit && Dummy.validRecordByQuery(rec, query)) {
                rec = options.upsert === false ? this : Object.assign({},rec,this);
                rec = JSON.parse(JSON.stringify(rec));
                results.push(rec);
                counter++
            }
            arr.push(rec);
            return arr;
        }, []);

        if(results.length === 0){
            throw new SugoiModelException("Not updated", 5000);
        }
        return options.limit ===  1 ? results[0]:results;
    }

    public static upsert(record) {
        return new Promise(resolve => {
            setTimeout(() => {
                const rec = {...record};
                Dummy.RECORDS.push(rec);
                resolve(rec);
            }, 1000)
        });

    }

    public static filterByQuery(query, limit = Dummy.RECORDS.length, sort?: SortItem, not: boolean = false, preserveIndexes: boolean = false) {
        if (sort) {
            Dummy.RECORDS.sort((a, b) => {
                const aField = a[sort.field];
                const bField = b[sort.field];
                return sort.sortOption === SortOptions.DESC ? bField - aField : aField - bField;
            });
        }
        let counter = 0;
        return Dummy.RECORDS.reduce((arr, rec) => {
            let valid = Dummy.validRecordByQuery(rec, query);
            valid = not ? !valid : valid;
            if (valid && (not || (counter++ < limit))) {
                arr.push(rec);
            }
            else if (preserveIndexes)
                arr.push({});
            return arr;
        }, []);
    }

    public static validRecordByQuery(record, query) {
        let valid = false;
        for (let prop in query) {
            valid = true;
            valid = valid && (typeof query[prop] === "string"
                ? record[prop].indexOf(query[prop]) > -1
                : query[prop] === record[prop]);
            if (!valid) break;
        }
        return valid;
    }

    beforeValidate(): Promise<any> | void {
        this.name = this.isUpdate && this.name.indexOf("u_") != 0
            ? "u_" + this.name : this.name;
    }

    beforeUpdate(): Promise<any> | void {
        this.lastUpdated = "today";
        // this.removeMandatoryFields("name");
        if(!this.name) delete this.name;
        return Dummy.connect();
    }

    afterUpdate(updateResponse?: any): Promise<any> | void {
        this.updated = this.lastUpdated === "today";
        // this.addMandatoryField("name");

    }

    beforeSave(): Promise<any> | void {
        this.id = StringUtils.generateGuid();
        this.lastSaved = "today";
        this.lastSavedTime = new Date().getTime();
        return Dummy.connect();
    }

    afterSave(saveResponse?: any): Promise<any> | void {
        this.saved = true;
    }

    validate(): Promise<string | boolean> {
        return Promise.resolve(isNaN(parseInt(<string>this.name)));
    }

    static builder<T=Dummy>(name) {
        return (<any>new this(name)) as T;
    }
}