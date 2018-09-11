import {SortItem} from "./sort-item.class";

export class QueryOptions{
    protected sort:Array<SortItem>;
    protected offset:number;
    public limit:number;

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

    setSortOption(...sort:Array<SortItem>){
        this.sort = sort;
        return this;
    }

    getSortOption(){
        return this.sort || [];
    }
}