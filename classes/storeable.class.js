"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ignore_decorator_1 = require("../decorators/ignore.decorator");
const string_util_1 = require("@sugoi/core/dist/policies/utils/string.util");
const IGNORED_FIELDS_OBJECT_KEY = "IGNORED_FIELDS_OBJECT";
class Storeable {
    constructor() {
        this.modelInstanceMeta = new Map();
    }
    static setModelMeta(key, value) {
        this.ModelMeta.set(key, value);
    }
    setModelMeta(key, value) {
        this.modelInstanceMeta.set(key, value);
    }
    static getModelMeta(key) {
        return this.ModelMeta.get(key);
    }
    getModelMeta(key) {
        return this.modelInstanceMeta.get(key);
    }
    static hasModelMeta(key) {
        return this.ModelMeta.has(key);
    }
    hasModelMeta(key) {
        return this.modelInstanceMeta.has(key);
    }
    static deleteModelMeta(key) {
        this.ModelMeta.delete(key);
    }
    deleteModelMeta(key) {
        this.modelInstanceMeta.delete(key);
    }
    addFieldsToIgnore(...fields) {
        ignore_decorator_1.addIgnoredFields(this, ...fields);
    }
    removeFieldsFromIgnored(...fields) {
        ignore_decorator_1.removeFieldsFromIgnored(this, ...fields);
    }
    initIgnoredFields() {
        ignore_decorator_1.initInstanceIgnoredFields(this);
    }
    getIgnoredFields() {
        return ignore_decorator_1.getIgnoredFields(this);
    }
    removeIgnoredFields() {
        const key = string_util_1.StringUtils.generateGuid();
        const ignoredFields = this.getIgnoredFields();
        const metaObject = {};
        ignoredFields.forEach(field => {
            if (!this.hasOwnProperty(field))
                return;
            metaObject[field] = this[field];
            delete this[field];
        });
        this.constructor.setModelMeta(IGNORED_FIELDS_OBJECT_KEY + "_" + key, metaObject);
        return key;
    }
    revertIgnoredFields(key, value, removeRecord = true) {
        const metaObject = this.constructor.getModelMeta(IGNORED_FIELDS_OBJECT_KEY + "_" + key);
        Object.assign(this, metaObject, value);
        if (removeRecord)
            this.constructor.deleteModelMeta(IGNORED_FIELDS_OBJECT_KEY + "_" + key);
        return this;
    }
}
Storeable.ModelMeta = new Map();
exports.Storeable = Storeable;
ignore_decorator_1.addIgnoredFields(Storeable, "modelInstanceMeta");
