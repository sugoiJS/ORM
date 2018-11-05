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
                return this.cast(collection, options && options.applyConstructorOnCast);
            });
            return res;
        })
            .then((data) => this.prototype.sugAfterFind(data).then((res) => res || data));
    }
    static findEmitter(query, options) {
        throw new index_1.SugoiModelException(index_1.EXCEPTIONS.NOT_IMPLEMENTED.message, index_1.EXCEPTIONS.NOT_IMPLEMENTED.code, "Find Emitter " + this.constructor.name);
    }
    ;
    save(options, data = this) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sugBeforeValidate(options)
                .then(() => {
                return this.sugValidate();
            })
                .then((valid) => {
                if (valid !== true)
                    throw new index_1.SugoiModelException(index_1.EXCEPTIONS.INVALID.message, index_1.EXCEPTIONS.INVALID.code, valid);
            })
                .then(() => this.sugBeforeSave())
                .then(() => this.hideIgnoredFields())
                .then(() => this.saveEmitter(options, data))
                .then((savedData) => {
                Object.assign(this, savedData);
                this.flagMetaAsIgnored();
                return this;
            })
                .then((savedData) => {
                return this.sugAfterSave(savedData).then((res) => res || savedData);
            });
        });
    }
    sugBeforeValidate(options) {
        return 'beforeValidate' in this
            ? this.beforeValidate(options) || Promise.resolve()
            : Promise.resolve();
    }
    sugValidate() {
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
    update(options, query = this.getIdQuery()) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sugBeforeValidate(options)
                .then(() => {
                if ((!options || options.limit == null) && query.hasOwnProperty(primary_decorator_1.getPrimaryKey(this)))
                    options = Object.assign({}, options, query_options_class_1.QueryOptions.builder().setLimit(1));
                if (options && options.hasOwnProperty("skipRequiredValidation"))
                    this.skipRequiredFieldsValidation(options.skipRequiredValidation);
                return this.sugValidate();
            })
                .then((valid) => {
                if (valid !== true)
                    throw new index_1.SugoiModelException(index_1.EXCEPTIONS.INVALID.message, index_1.EXCEPTIONS.INVALID.code, valid);
            })
                .then(() => this.sugBeforeUpdate())
                .then(() => this.hideIgnoredFields())
                .then(() => this.updateEmitter(options, query))
                .then((updatedData) => {
                Object.assign(this, updatedData);
                this.flagMetaAsIgnored();
                return this;
            })
                .then((updatedData) => {
                return this.sugAfterUpdate(updatedData).then((res) => res || updatedData);
            });
        });
    }
    static updateAll(query, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectInstance = this.clone(this, data, options && options.applyConstructorOnCast);
            return objectInstance.update(options, query);
        });
    }
    static updateById(id, data, options = query_options_class_1.QueryOptions.builder().setLimit(1)) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectInstance = this.clone(this, data, options && options.applyConstructorOnCast);
            objectInstance.setPrimaryPropertyValue(id);
            const key = primary_decorator_1.getPrimaryKey(objectInstance);
            return objectInstance.update(options, { [key]: id });
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
     * @param {boolean }applyConstructor - should apply class constructor
     * @returns {T}
     */
    static clone(classIns, data, applyConstructor = false) {
        if (arguments.length < 3
            && ((arguments.length === 1) || (arguments.length === 2 && typeof arguments[1] === "boolean"))) {
            data = classIns;
            classIns = this;
        }
        const instance = index_1.clone(classIns, data, applyConstructor);
        instance['_initInstanceMetaField']();
        return instance;
    }
    static cast(data, applyConstructor = false) {
        return this.clone(data, applyConstructor);
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
    validateModel(options) {
        return this.sugBeforeValidate(options)
            .then(() => this.sugValidate());
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
