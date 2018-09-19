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
    QueryOptions.prototype.getLimit = function () {
        return this.limit;
    };
    QueryOptions.prototype.setOffset = function (offset) {
        this.offset = offset;
        return this;
    };
    QueryOptions.prototype.getOffset = function () {
        return this.offset;
    };
    QueryOptions.prototype.setSortOption = function () {
        var sort = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            sort[_i] = arguments[_i];
        }
        this.sort = sort;
        return this;
    };
    QueryOptions.prototype.getSortOption = function () {
        return this.sort || [];
    };
    return QueryOptions;
}());
exports.QueryOptions = QueryOptions;
