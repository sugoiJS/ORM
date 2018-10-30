"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ignore_decorator_1 = require("../decorators/ignore.decorator");
const decorators_key_constant_1 = require("../constants/decorators-key.constant");
const mandatory_decorator_1 = require("../decorators/mandatory.decorator");
class Storeable {
    constructor() {
        this.modelInstanceMeta = {};
        this.flagMetaAsIgnored();
        this.hideIgnoredFields();
    }
    flagMetaAsIgnored() {
        this.flagAsIgnored('modelInstanceMeta', true);
    }
    flagAsIgnored(field, ignored) {
        const descriptor = Object.getOwnPropertyDescriptor(this, field);
        if (!descriptor)
            return;
        descriptor.enumerable = !ignored;
        descriptor.configurable = true;
        Object.defineProperty(this, field, descriptor);
    }
    static setModelMeta(key, value) {
        this.ModelMeta[key] = value;
    }
    setModelMeta(key, value) {
        this.modelInstanceMeta[key] = value;
    }
    static getModelMeta(key) {
        return this.ModelMeta[key];
    }
    getModelMeta(key) {
        return this.modelInstanceMeta[key];
    }
    static hasModelMeta(key) {
        return this.ModelMeta.hasOwnProperty(key);
    }
    hasModelMeta(key) {
        return this.modelInstanceMeta.hasOwnProperty(key);
    }
    static deleteModelMeta(key) {
        delete this.ModelMeta[key];
    }
    deleteModelMeta(key) {
        delete this.modelInstanceMeta[key];
    }
    addFieldsToIgnore(...fields) {
        ignore_decorator_1.addIgnoredFields(this, ...fields);
        fields.forEach(field => this.flagAsIgnored(field, true));
    }
    removeFieldsFromIgnored(...fields) {
        ignore_decorator_1.removeFieldsFromIgnored(this, ...fields);
        fields.forEach(field => this.flagAsIgnored(field, false));
    }
    initIgnoredFields() {
        this.showIgnoredFields();
        ignore_decorator_1.initInstanceIgnoredFields(this);
        this.hideIgnoredFields();
    }
    getIgnoredFields() {
        return ignore_decorator_1.getIgnoredFields(this);
    }
    hideIgnoredFields() {
        const ignoredFields = this.getIgnoredFields();
        ignoredFields.forEach(field => {
            this.flagAsIgnored(field, true);
        });
    }
    showIgnoredFields() {
        const ignoredFields = this.getIgnoredFields();
        ignoredFields.forEach(field => {
            if (field === "modelInstanceMeta")
                return;
            this.flagAsIgnored(field, false);
        });
    }
    getMandatoryFields() {
        const fields = Object.assign({}, this.getInstanceMandatoryFields(), mandatory_decorator_1.getMandatoryFields(this));
        Array.from(this.getIgnoreMandatoryFields())
            .forEach(field => {
            delete fields[field];
        });
        return fields;
    }
    getInstanceMandatoryFields() {
        return this.getModelMeta(decorators_key_constant_1.DECORATOR_KEYS.MANDATORY_KEY) || {};
    }
    addMandatoryField(field, condition) {
        mandatory_decorator_1.addInstanceMandatoryField(this, field, condition);
    }
    getIgnoreMandatoryFields() {
        return this.getModelMeta(decorators_key_constant_1.DECORATOR_KEYS.IGNORE_MANDATORY_KEY) || new Set();
    }
    setIgnoreMandatoryFields(fields) {
        this.setModelMeta(decorators_key_constant_1.DECORATOR_KEYS.IGNORE_MANDATORY_KEY, fields);
    }
    removeMandatoryFields(...fields) {
        const instanceFields = this.getInstanceMandatoryFields();
        const classFields = [];
        fields.forEach(field => {
            if (!instanceFields.hasOwnProperty(field)) {
                classFields.push(field);
                return;
            }
            else {
                delete instanceFields[field];
            }
        });
        if (classFields.length > 0) {
            const classIgnoreMandatory = this.getIgnoreMandatoryFields();
            classFields.forEach(field => classIgnoreMandatory.add(field));
            this.setIgnoreMandatoryFields(classIgnoreMandatory);
        }
    }
    _initInstanceMetaField() {
        this.modelInstanceMeta = {};
        this.flagMetaAsIgnored();
        this.hideIgnoredFields();
    }
}
Storeable.ModelMeta = {};
exports.Storeable = Storeable;
