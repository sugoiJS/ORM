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
    setSortOptions(...sort: Array<SortItem>): this;
    /**
     * @deprecated
     * @use setSortOptions
     * @param {SortItem} sort
     */
    setSortOption(...sort: Array<SortItem>): this;
    getSortOptions(): SortItem[];
    /**
     * @deprecated
     * @use getSortOptions
     */
    getSortOption(): SortItem[];
}
