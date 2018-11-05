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
    getSortOptions() {
        return this.sort || [];
    }
    setSkipRequiredValidation(skip) {
        this.skipRequiredValidation = skip;
        return this;
    }
    getSkipRequiredValidation() {
        return this.skipRequiredValidation;
    }
}
exports.QueryOptions = QueryOptions;
