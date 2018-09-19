import { SortItem } from "./sort-item.class";
export declare class QueryOptions {
    protected sort: Array<SortItem>;
    protected offset: number;
    limit: number;
    static builder(): QueryOptions;
    constructor();
    setLimit(limit: number): this;
    getLimit(): number;
    setOffset(offset: number): this;
    getOffset(): number;
    setSortOption(...sort: Array<SortItem>): this;
    getSortOption(): SortItem[];
}
