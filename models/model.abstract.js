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
const mandatory_decorator_1 = require("../decorators/mandatory.decorator");
const core_1 = require("@sugoi/core");
const decorators_key_constant_1 = require("../constants/decorators-key.constant");
class ModelAbstract extends storeable_class_1.Storeable {
    constructor() {
        super();
    }
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
        return this.validateModel();
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
    validateModel() {
        const valid = this.getModelMeta(decorators_key_constant_1.DECORATOR_KEYS.SKIP_MANDATORY_VALIDATION)
            ? { valid: true }
            : this.validateMandatoryFields();
        if (!valid.valid) {
            return Promise.resolve(valid);
        }
        return 'validate' in this
            ? this.validate().then(valid => (valid === undefined) ? true : !!valid)
            : Promise.resolve(true);
    }
    validateMandatoryFields() {
        const result = { valid: false, invalidValue: null, expectedValue: null, field: null };
        const fields = mandatory_decorator_1.getMandatoryFields(this);
        if (!fields) {
            result.valid = true;
            return result;
        }
        Object.keys(fields).every((field) => {
            result.field = field;
            result.invalidValue = this[field];
            if (fields[field].condition) {
                const validate = core_1.ValidateSchemaUtil.ValidateSchema(this[field], fields[field].condition);
                result.invalidValue = validate.invalidValue;
                result.expectedValue = validate.expectedValue;
                result.valid = validate.valid;
            }
            else if (fields[field].allowEmptyString) {
                result.expectedValue = "!null";
                result.valid = this[field] != null || this[field] === "";
            }
            else {
                result.expectedValue = "!null && !''";
                result.valid = this[field] != null && this[field] !== "";
            }
            return result.valid;
        });
        return result;
    }
    skipRequiredFieldsValidation(shouldSkip) {
        this.setModelMeta(decorators_key_constant_1.DECORATOR_KEYS.SKIP_MANDATORY_VALIDATION, shouldSkip);
    }
}
exports.ModelAbstract = ModelAbstract;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwuYWJzdHJhY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9tb2RlbHMvbW9kZWwuYWJzdHJhY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLG9DQUF5RDtBQUV6RCx1RUFBOEQ7QUFFOUQsd0VBQTREO0FBQzVELHdEQUE0QztBQUM1QyxnRUFBcUQ7QUFDckQsMkVBQXFFO0FBQ3JFLHNDQUErQztBQUUvQyxrRkFBb0U7QUFHcEUsTUFBc0IsYUFBYyxTQUFRLDJCQUFTO0lBR2pEO1FBQ0ksS0FBSyxFQUFFLENBQUE7SUFDWCxDQUFDO0lBRU0sTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFlLElBQUksQ0FBQyxJQUFJO1FBQy9DLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUNoQyxDQUFDO0lBRU0sTUFBTSxDQUFDLGlCQUFpQixDQUFDLE9BQWUsSUFBSSxDQUFDLElBQUk7UUFDcEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7SUFDMUIsQ0FBQztJQUVNLE1BQU0sQ0FBQyxZQUFZO1FBQ3RCLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDcEMsQ0FBQztJQUVNLE1BQU0sQ0FBQyxpQkFBaUI7UUFDM0IsT0FBTyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDdkMsQ0FBQztJQUVNLE1BQU0sQ0FBQyxJQUFJLENBQVEsUUFBYSxFQUFFLEVBQUUsT0FBcUM7UUFDNUUsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRU0sTUFBTSxDQUFDLE9BQU8sQ0FBUSxRQUFhLEVBQUUsRUFBRSxVQUF1QyxrQ0FBWSxDQUFDLE9BQU8sRUFBRTtRQUN2RyxPQUFPLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNsQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUksS0FBSyxF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