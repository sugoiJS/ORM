import {SortItem} from "./sort-item.class";

export class QueryOptions{
    protected sort:Array<SortItem>;
    protected offset:number;
    public skipRequiredValidation:boolean;
    public limit:number;
    public applyConstructorOnCast:boolean;

    public static builder(){
        return new QueryOptions();
    }

    constructor(){}

    setLimit(limit:number){
        this.limit = limit;
        return this;
    }

    getLimit(){
        return this.limit;
    }

    setOffset(offset:number){
        this.offset = offset;
        return this;
    }

    getOffset(){
        return this.offset;
    }

    setSortOptions(...sort:Array<SortItem>){
        this.sort = sort;
        return this;
    }

    getSortOptions(){
        return this.sort || [];
    }

    setSkipRequiredValidation(skip:boolean){
        this.skipRequiredValidation = skip;
        return this;
    }
    getSkipRequiredValidation():boolean{
        return this.skipRequiredValidation;
    }
}