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

    setSortOptions(...sort:Array<SortItem>){
        this.sort = sort;
        return this;
    }

    /**
     * @deprecated
     * @use setSortOptions
     * @param {SortItem} sort
     */
    setSortOption(...sort:Array<SortItem>){
        return this.setSortOptions(...sort);

    }

    getSortOptions(){
        return this.sort || [];
    }

    /**
     * @deprecated
     * @use getSortOptions
     */
    getSortOption(){
        return this.getSortOptions();
    }
}