"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryOptions {
    static builder() {
        return new QueryOptions();
    }
    constructor() { }
    setLimit(limit) {
        this.limit = limit;
        return this;
    }
    getLimit() {
        return this.limit;
    }
    setOffset(offset) {
        this.offset = offset;
        return this;
    }
    getOffset() {
        return this.offset;
    }
    setSortOptions(...sort) {
        this.sort = sort;
        return this;
    }
    /**
     * @deprecated
     * @use setSortOptions
     * @param {SortItem} sort
     */
    setSortOption(...sort) {
        return this.setSortOptions(...sort);
    }
    getSortOptions() {
        return this.sort || [];
    }
    /**
     * @deprecated
     * @use getSortOptions
     */
    getSortOption() {
        return this.getSortOptions();
    }
}
exports.QueryOptions = QueryOptions;
