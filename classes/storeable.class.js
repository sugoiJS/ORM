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
}
Storeable.ModelMeta = {};
exports.Storeable = Storeable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmVhYmxlLmNsYXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vY2xhc3Nlcy9zdG9yZWFibGUuY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxRUFLd0M7QUFDeEMsa0ZBQW9FO0FBRXBFLDJFQUFnRztBQUVoRyxNQUFhLFNBQVM7SUFLbEI7UUFGVSxzQkFBaUIsR0FBNEIsRUFBRSxDQUFDO1FBR3RELElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFTSxpQkFBaUI7UUFDcEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRU8sYUFBYSxDQUFDLEtBQWEsRUFBRSxPQUFnQjtRQUNqRCxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsd0JBQXdCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxVQUFVO1lBQUUsT0FBTztRQUN4QixVQUFVLENBQUMsVUFBVSxHQUFHLENBQUMsT0FBTyxDQUFDO1FBQ2pDLFVBQVUsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQy9CLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRU0sTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFXLEVBQUUsS0FBVTtRQUM5QyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztJQUNoQyxDQUFDO0lBRU0sWUFBWSxDQUFDLEdBQVcsRUFBRSxLQUFVO1FBQ3ZDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7SUFDeEMsQ0FBQztJQUVNLE1BQU0sQ0FBQyxZQUFZLENBQVEsR0FBVztRQUN6QyxPQUFPLElBQUksQ0FBQyxTQUFT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