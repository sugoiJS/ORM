"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var QueryOptions = /** @class */ (function () {
    function QueryOptions() {
    }
    QueryOptions.builder = function () {
        return new QueryOptions();
    };
    QueryOptions.prototype.setLimit = function (limit) {
        this.limit = limit;
        return this;
    };
    QueryOptions.prototype.setSortOption = function (sortOption) {
        this.sort = sortOption;
    };
    return QueryOptions;
}());
exports.QueryOptions = QueryOptions;
