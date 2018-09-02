import { SortOptions } from "../constants/sort-options.enum";
export declare class QueryOptions {
    sort: SortOptions;
    limit: number;
    static builder(): QueryOptions;
    constructor();
    setLimit(limit: number): this;
    setSortOption(sortOption: SortOptions): void;
}
