import {SortOptions} from "../constants/sort-options.enum";

export class QueryOptions{
    public sort:SortOptions;
    public limit:number;

    public static builder(){
        return new QueryOptions();
    }

    constructor(){}

    setLimit(limit:number){
        this.limit = limit;
        return this;
    }

    setSortOption(sortOption:SortOptions){
        this.sort = sortOption
    }
}