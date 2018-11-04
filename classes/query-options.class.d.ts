import { SortItem } from "./sort-item.class";
export declare class QueryOptions {
    protected sort: Array<SortItem>;
    protected offset: number;
    skipRequiredValidation: boolean;
    limit: number;
    static builder(): QueryOptions;
    constructor();
    setLimit(limit: number): this;
    getLimit(): number;
    setOffset(offset: number): this;
    getOffset(): number;
    setSortOptions(...sort: Array<SortItem>): this;
    getSortOptions(): SortItem[];
    setSkipRequiredValidation(skip: boolean): this;
    getSkipRequiredValidation(): boolean;
}
