"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const primary_decorator_1 = require("../decorators/primary.decorator");
const query_options_class_1 = require("../classes/query-options.class");
const object_utils_1 = require("../utils/object.utils");
const storeable_class_1 = require("../classes/storeable.class");
class ModelAbstract extends storeable_class_1.Storeable {
    constructor() { super(); }
    static setModelName(name = this.name) {
        this.setCollectionName(name);
    }
    static setCollectionName(name = this.name) {
        this.modelName = name;
    }
    static getModelName() {
        return this.getCollectionName();
    }
    static getCollectionName() {
        return this.modelName || this.name;
    }
    static find(query = {}, options) {
        return this.findPipe(query, options);
    }
    static findOne(query = {}, options = query_options_class_1.QueryOptions.builder()) {
        options.limit = 1;
        return this.find(query, options)
            .then(res => res ? res[0] : null);
    }
    static findAll(query = {}, options) {
        return this.find(query, options)
            .then(res => res ? res : null);
    }
    static findById(id, options) {
        return this.findOne(this.castIdToQuery(id), options);
    }
    sugBeforeFind(query, options) {
        return 'beforeFind' in this
            ? this.beforeFind(query, options) || Promise.resolve()
            : Promise.resolve();
    }
    ;
    sugAfterFind(resolvedData) {
        return 'afterFind' in this
            ? this.afterFind(resolvedData) || Promise.resolve()
            : Promise.resolve();
    }
    ;
    static findPipe(query, options) {
        return this.prototype.sugBeforeFind(query, options)
            .then(() => this.findEmitter(query, options))
            .then((res) => {
            if (!Array.isArray(res))
                res = [res];
            res = res.map((collection) => {
                return this.clone(this, collection);
            });
            return res;
        })
            .then((data) => this.prototype.sugAfterFind(data).then((res) => res || data));
    }
    static findEmitter(query, options) {
        throw new index_1.SugoiModelException(index_1.EXCEPTIONS.NOT_IMPLEMENTED.message, index_1.EXCEPTIONS.NOT_IMPLEMENTED.code, "Find Emitter " + this.constructor.name);
    }
    ;
    save(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sugBeforeValidate()
                .then(() => {
                return this.sugValidate();
            })
                .then((valid) => {
                if (valid !== true)
                    throw new index_1.SugoiModelException(index_1.EXCEPTIONS.INVALID.message, index_1.EXCEPTIONS.INVALID.code, valid);
            })
                .then(() => this.sugBeforeSave())
                .then(() => this.hideIgnoredFields())
                .then(() => this.saveEmitter(options))
                .then((res) => {
                this.revertIgnoredFields();
                return res;
            })
                .then((savedData) => {
                if (typeof this !== "function") //check if is instance
                    savedData = this.constructor.clone(this.constructor, savedData);
                else
                    savedData = this.clone(this, savedData);
                Object.assign(this, savedData);
                this.flagMetaAsIgnored();
                return this;
            })
                .then((savedData) => {
                return this.sugAfterSave(savedData).then((res) => res || savedData);
            });
        });
    }
    sugBeforeValidate() {
        return 'beforeValidate' in this
            ? this.beforeValidate() || Promise.resolve()
            : Promise.resolve();
    }
    sugValidate() {
        return 'validate' in this
            ? this.validate().then(valid => (valid === undefined) ? true : !!valid)
            : Promise.resolve(true);
    }
    ;
    sugBeforeSave() {
        return "beforeSave" in this
            ? this.beforeSave() || Promise.resolve()
            : Promise.resolve();
    }
    ;
    sugAfterSave(savedData) {
        return 'afterSave' in this
            ? this.afterSave(savedData) || Promise.resolve()
            : Promise.resolve();
    }
    ;
    update(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sugBeforeValidate()
                .then(() => {
                return this.sugValidate();
            })
                .then((valid) => {
                if (valid !== true)
                    throw new index_1.SugoiModelException(index_1.EXCEPTIONS.INVALID.message, index_1.EXCEPTIONS.INVALID.code, valid);
            })
                .then(() => this.sugBeforeUpdate())
                .then(() => this.hideIgnoredFields())
                .then(() => this.updateEmitter(options))
                .then((res) => {
                this.revertIgnoredFields();
                return res;
            })
                .then((updatedData) => {
                if (typeof this !== "function") //check if is instance
                    updatedData = this.constructor.clone(this.constructor, updatedData);
                else
                    updatedData = this.clone(this, updatedData);
                Object.assign(this, updatedData);
                this.flagMetaAsIgnored();
                return this;
            })
                .then((updatedData) => {
                return this.sugAfterUpdate(updatedData).then((res) => res || updatedData);
            });
        });
    }
    static updateById(id, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectInstance = this.clone(this, data);
            objectInstance.setPrimaryPropertyValue(id);
            return objectInstance.update(options);
        });
    }
    sugBeforeUpdate() {
        return 'beforeUpdate' in this
            ? this.beforeUpdate() || Promise.resolve()
            : Promise.resolve();
    }
    ;
    sugAfterUpdate(updatedData) {
        return 'afterUpdate' in this
            ? this.afterUpdate(updatedData) || Promise.resolve()
            : Promise.resolve();
    }
    ;
    remove(query = this.getIdQuery(), options) {
        return this.constructor.removePipe(query, options);
    }
    static removeById(id, options) {
        return this.removeOne(this.castIdToQuery(id), options);
    }
    static removeOne(query = {}, options = query_options_class_1.QueryOptions.builder()) {
        options.limit = 1;
        return this.removePipe(query, options);
    }
    static removeAll(query = {}, options) {
        return this.removePipe(query, options);
    }
    static removePipe(query, options) {
        return this.prototype.sugBeforeRemove(query, options)
            .then(() => this.removeEmitter(query, options))
            .then((data) => this.prototype.sugAfterRemove(data).then(res => res || data));
    }
    static removeEmitter(query, options) {
        throw new index_1.SugoiModelException(index_1.EXCEPTIONS.NOT_IMPLEMENTED.message, index_1.EXCEPTIONS.NOT_IMPLEMENTED.code, "Remove Emitter " + this.constructor.name);
    }
    ;
    sugBeforeRemove(query, options) {
        return 'beforeRemove' in this
            ? this.beforeRemove(query, options) || Promise.resolve()
            : Promise.resolve();
    }
    ;
    sugAfterRemove(data) {
        return 'afterRemove' in this
            ? this.afterRemove(data) || Promise.resolve()
            : Promise.resolve();
    }
    ;
    /**
     * Set the value of class primary property
     *
     * @param {TIdentifierTypes} value
     */
    setPrimaryPropertyValue(value) {
        const primaryKey = primary_decorator_1.getPrimaryKey(this);
        if (!primaryKey)
            throw new index_1.SugoiModelException(index_1.EXCEPTIONS.PRIMARY_NOT_CONFIGURED.message, index_1.EXCEPTIONS.PRIMARY_NOT_CONFIGURED.code, this["constructor"].getModelName());
        this[primaryKey] = value;
    }
    /**
     * Transform data into class(T) instance
     * @param classIns - class instance
     * @param data - data to transform
     * @returns {T}
     */
    static clone(classIns, data) {
        if (arguments.length === 1) {
            data = classIns;
            classIns = this;
        }
        const instance = object_utils_1.clone(classIns, data);
        instance.flagMetaAsIgnored();
        return instance;
    }
    /**
     * In case string is passed this function build query object using the class primary key
     * @param {string | any} query
     * @param {any} classToUse - class to take the primary key from
     * @returns {{[prop:string}:TIdentifierTypes}
     */
    static castIdToQuery(query, classToUse = this) {
        if (typeof query === "string") {
            const primaryKey = primary_decorator_1.getPrimaryKey(classToUse);
            const id = query;
            query = {};
            if (primaryKey)
                query[primaryKey] = id;
        }
        return query;
    }
    /**
     * Check if the primary key found in the query and return his value
     *
     * @param query - The query object
     * @param {any} classToUse - class to take the primary key from
     * @param {boolean} deleteProperty - flag to remove the primaryKey property from the query
     * @returns {TIdentifierTypes}
     */
    static getIdFromQuery(query, classToUse = this, deleteProperty = true) {
        const primaryKey = primary_decorator_1.getPrimaryKey(classToUse);
        const id = query && query.hasOwnProperty(primaryKey) ? query[primaryKey] : null;
        if (deleteProperty) {
            delete query[primaryKey];
        }
        return id;
    }
    /**
     * build and return query object containing the primary key and his value
     * @returns {{[primaryKey]:TIdentifierTypes}}
     */
    getIdQuery() {
        const primaryKey = primary_decorator_1.getPrimaryKey(this);
        return primaryKey ? { [primaryKey]: this[primaryKey] } : null;
    }
}
exports.ModelAbstract = ModelAbstract;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwuYWJzdHJhY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9tb2RlbHMvbW9kZWwuYWJzdHJhY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLG9DQUF5RDtBQUV6RCx1RUFBOEQ7QUFFOUQsd0VBQTREO0FBQzVELHdEQUE0QztBQUM1QyxnRUFBcUQ7QUFHckQsTUFBc0IsYUFBYyxTQUFRLDJCQUFTO0lBR2pELGdCQUFjLEtBQUssRUFBRSxDQUFBLENBQUEsQ0FBQztJQUVmLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBZSxJQUFJLENBQUMsSUFBSTtRQUMvQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDaEMsQ0FBQztJQUVNLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFlLElBQUksQ0FBQyxJQUFJO1FBQ3BELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQzFCLENBQUM7SUFFTSxNQUFNLENBQUMsWUFBWTtRQUN0QixPQUFPLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQ3BDLENBQUM7SUFFTSxNQUFNLENBQUMsaUJBQWlCO1FBQzNCLE9BQU8sSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3ZDLENBQUM7SUFFTSxNQUFNLENBQUMsSUFBSSxDQUFRLFFBQWEsRUFBRSxFQUFFLE9BQXFDO1FBQzVFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVNLE1BQU0sQ0FBQyxPQUFPLENBQVEsUUFBYSxFQUFFLEVBQUUsVUFBdUMsa0NBQVksQ0FBQyxPQUFPLEVBQUU7UUFDdkcsT0FBTyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDbEIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFJLEtBQUssRUFBRSxPQUFPLENBQUM7YUFDOUIsSUFBSSxDQUFDLEdBQUcsQ0FB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