"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
var primary_decorator_1 = require("../decorators/primary.decorator");
var query_options_class_1 = require("../classes/query-options.class");
var ModelAbstract = /** @class */ (function () {
    function ModelAbstract() {
    }
    ModelAbstract.setModelName = function (name) {
        if (name === void 0) { name = this.name; }
        this.setCollectionName(name);
    };
    ModelAbstract.setCollectionName = function (name) {
        if (name === void 0) { name = this.name; }
        this.collectionName = name;
    };
    ModelAbstract.getModelName = function () {
        return this.getCollectionName();
    };
    ModelAbstract.getCollectionName = function () {
        return this.collectionName || this.name;
    };
    ModelAbstract.find = function (query, options) {
        if (query === void 0) { query = {}; }
        return this.findPipe(query, options);
    };
    ModelAbstract.findOne = function (query, options) {
        if (query === void 0) { query = {}; }
        if (options === void 0) { options = query_options_class_1.QueryOptions.builder(); }
        options.limit = 1;
        return this.find(query, options)
            .then(function (res) { return res ? res[0] : null; });
    };
    ModelAbstract.findAll = function (query, options) {
        if (query === void 0) { query = {}; }
        return this.find(query, options)
            .then(function (res) { return res ? res : null; });
    };
    ModelAbstract.findById = function (id, options) {
        return this.findOne(this.castIdToQuery(id), options);
    };
    ModelAbstract.prototype.sugBeforeFind = function () {
        return 'beforeFind' in this
            ? this.beforeFind() || Promise.resolve()
            : Promise.resolve();
    };
    ;
    ModelAbstract.prototype.sugAfterFind = function (resolvedData) {
        return 'afterFind' in this
            ? this.afterFind(resolvedData) || Promise.resolve()
            : Promise.resolve();
    };
    ;
    ModelAbstract.findPipe = function (query, options) {
        var _this = this;
        return this.prototype.sugBeforeFind()
            .then(function () { return _this.findEmitter(query, options); })
            .then(function (res) {
            if (!Array.isArray(res))
                res = [res];
            res = res.map(function (collection) {
                return _this.clone(_this, collection);
            });
            return res;
        })
            .then(function (data) { return _this.prototype.sugAfterFind(data).then(function (res) { return res || data; }); });
    };
    ModelAbstract.findEmitter = function (query, options) {
        throw new index_1.SugoiModelException(index_1.EXCEPTIONS.NOT_IMPLEMENTED.message, index_1.EXCEPTIONS.NOT_IMPLEMENTED.code, "Find Emitter " + this.constructor.name);
    };
    ;
    ModelAbstract.prototype.save = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var savedData;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sugBeforeValidate()
                            .then(function () {
                            return _this.sugValidate();
                        })
                            .then(function (valid) {
                            if (valid !== true)
                                throw new index_1.SugoiModelException(index_1.EXCEPTIONS.INVALID.message, index_1.EXCEPTIONS.INVALID.code, valid);
                        })
                            .then(function () { return _this.sugBeforeSave(); })
                            .then(function () { return _this.saveEmitter(options); })
                            .then(function (savedData) {
                            return _this.sugAfterSave(savedData).then(function (res) { return res || savedData; });
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ModelAbstract.prototype.sugBeforeValidate = function () {
        return 'beforeValidate' in this
            ? this.beforeValidate() || Promise.resolve()
            : Promise.resolve();
    };
    ModelAbstract.prototype.sugValidate = function () {
        return 'validate' in this
            ? this.validate().then(function (valid) { return (valid === undefined) ? true : !!valid; })
            : Promise.resolve(true);
    };
    ;
    ModelAbstract.prototype.sugBeforeSave = function () {
        return "beforeSave" in this
            ? this.beforeSave() || Promise.resolve()
            : Promise.resolve();
    };
    ;
    ModelAbstract.prototype.sugAfterSave = function (savedData) {
        return 'afterSave' in this
            ? this.afterSave(savedData) || Promise.resolve()
            : Promise.resolve();
    };
    ;
    ModelAbstract.prototype.update = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedData;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sugBeforeValidate()
                            .then(function () {
                            return _this.sugValidate();
                        })
                            .then(function (valid) {
                            if (valid !== true)
                                throw new index_1.SugoiModelException(index_1.EXCEPTIONS.INVALID.message, index_1.EXCEPTIONS.INVALID.code, valid);
                        })
                            .then(function () { return _this.sugBeforeUpdate(); })
                            .then(function () { return _this.updateEmitter(options); })
                            .then(function (updatedData) {
                            return _this.sugAfterUpdate(updatedData).then(function (res) { return res || updatedData; });
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ModelAbstract.updateById = function (id, data, options) {
        return __awaiter(this, void 0, void 0, function () {
            var objectInstance;
            return __generator(this, function (_a) {
                objectInstance = this.clone(this, data);
                objectInstance.setPrimaryPropertyValue(id);
                return [2 /*return*/, objectInstance.update(options)];
            });
        });
    };
    ModelAbstract.prototype.sugBeforeUpdate = function () {
        return 'beforeUpdate' in this
            ? this.beforeUpdate() || Promise.resolve()
            : Promise.resolve();
    };
    ;
    ModelAbstract.prototype.sugAfterUpdate = function (updatedData) {
        return 'afterUpdate' in this
            ? this.afterUpdate(updatedData) || Promise.resolve()
            : Promise.resolve();
    };
    ;
    ModelAbstract.prototype.remove = function (query, options) {
        if (query === void 0) { query = this.getIdQuery(); }
        return this.constructor.removePipe(query, options);
    };
    ModelAbstract.removeById = function (id, options) {
        return this.removeOne(this.castIdToQuery(id), options);
    };
    ModelAbstract.removeOne = function (query, options) {
        if (query === void 0) { query = {}; }
        if (options === void 0) { options = query_options_class_1.QueryOptions.builder(); }
        options.limit = 1;
        return this.removePipe(query);
    };
    ModelAbstract.removeAll = function (query, options) {
        if (query === void 0) { query = {}; }
        return this.removePipe(query, options);
    };
    ModelAbstract.removePipe = function (query, options) {
        var _this = this;
        return this.prototype.sugBeforeRemove()
            .then(function () { return _this.removeEmitter(query, options); })
            .then(function (data) { return _this.prototype.sugAfterRemove(data).then(function (res) { return res || data; }); });
    };
    ModelAbstract.removeEmitter = function (query, options) {
        throw new index_1.SugoiModelException(index_1.EXCEPTIONS.NOT_IMPLEMENTED.message, index_1.EXCEPTIONS.NOT_IMPLEMENTED.code, "Remove Emitter " + this.constructor.name);
    };
    ;
    ModelAbstract.prototype.sugBeforeRemove = function () {
        return 'beforeRemove' in this
            ? this.beforeRemove() || Promise.resolve()
            : Promise.resolve();
    };
    ;
    ModelAbstract.prototype.sugAfterRemove = function (data) {
        return 'afterRemove' in this
            ? this.afterRemove(data) || Promise.resolve()
            : Promise.resolve();
    };
    ;
    /**
     * Set the value of class primary property
     *
     * @param {TIdentifierTypes} value
     */
    ModelAbstract.prototype.setPrimaryPropertyValue = function (value) {
        var primaryKey = primary_decorator_1.getPrimaryKey(this);
        if (!primaryKey)
            return;
        this[primaryKey] = value;
    };
    /**
     * Transform data into class(T) instance
     * @param classIns - class instance
     * @param data - data to transform
     * @returns {T}
     */
    ModelAbstract.clone = function (classIns, data) {
        var func = function () {
        };
        func.prototype = classIns.prototype;
        var temp = new func();
        classIns.apply(temp, []);
        temp.constructor = classIns;
        Object.assign(temp, data);
        return temp;
    };
    /**
     * In case string is passed this function build query object using the class primary key
     * @param {string | any} query
     * @param {any} classToUse - class to take the primary key from
     * @returns {{[prop:string}:TIdentifierTypes}
     */
    ModelAbstract.castIdToQuery = function (query, classToUse) {
        if (classToUse === void 0) { classToUse = this; }
        if (typeof query === "string") {
            var primaryKey = primary_decorator_1.getPrimaryKey(classToUse);
            var id = query;
            query = {};
            if (primaryKey)
                query[primaryKey] = id;
        }
        return query;
    };
    /**
     * Check if the primary key found in the query and return his value
     *
     * @param query - The query object
     * @param {any} classToUse - class to take the primary key from
     * @param {boolean} deleteProperty - flag to remove the primaryKey property from the query
     * @returns {TIdentifierTypes}
     */
    ModelAbstract.getIdFromQuery = function (query, classToUse, deleteProperty) {
        if (classToUse === void 0) { classToUse = this; }
        if (deleteProperty === void 0) { deleteProperty = true; }
        var primaryKey = primary_decorator_1.getPrimaryKey(classToUse);
        var id = query && query.hasOwnProperty(primaryKey) ? query[primaryKey] : null;
        if (deleteProperty) {
            delete query[primaryKey];
        }
        return id;
    };
    /**
     * build and return query object containing the primary key and his value
     * @returns {{[primaryKey]:TIdentifierTypes}}
     */
    ModelAbstract.prototype.getIdQuery = function () {
        var _a;
        var primaryKey = primary_decorator_1.getPrimaryKey(this);
        return primaryKey ? (_a = {}, _a[primaryKey] = this[primaryKey], _a) : null;
    };
    return ModelAbstract;
}());
exports.ModelAbstract = ModelAbstract;
