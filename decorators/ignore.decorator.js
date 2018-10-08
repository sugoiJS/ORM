"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_key_constant_1 = require("../constants/decorators-key.constant");
/**
 * Set property as primary key.
 * This key is use later to query, update and remove models.
 *
 * @returns {(contextClassInstance: Storeable, propertyKey: string) => void}
 * @constructor
 */
function Ignore() {
    return function (contextClassInstance, propertyKey) {
        const contextClass = contextClassInstance.constructor;
        addIgnoredFields(contextClass, propertyKey);
    };
}
exports.Ignore = Ignore;
function addIgnoredFields(contextClass, ...fields) {
    const ignoredFields = getInstanceIgnoredFields(contextClass) || new Set();
    const classFields = getClassIgnoredFields(contextClass);
    fields.forEach(field => {
        if (classFields && classFields.has(field))
            return;
        ignoredFields.add(field);
    });
    contextClass.setModelMeta(decorators_key_constant_1.DECORATOR_KEYS.IGNORE_KEY, new Set(ignoredFields));
}
exports.addIgnoredFields = addIgnoredFields;
function removeFieldsFromIgnored(contextClass, ...fields) {
    const instanceFields = getInstanceIgnoredFields(contextClass);
    const classFields = getClassIgnoredFields(contextClass);
    const instanceNotIgnored = getInstanceNotIgnoredFields(contextClass);
    const update = { instance: false, classLevel: false };
    fields.forEach(field => {
        if (instanceFields && instanceFields.has(field)) {
            instanceFields.delete(field);
            update.instance = true;
        }
        else if (classFields && classFields.has(field)) {
            instanceNotIgnored.add(field);
            update.classLevel = true;
        }
    });
    if (update.instance)
        contextClass.setModelMeta(decorators_key_constant_1.DECORATOR_KEYS.IGNORE_KEY, instanceFields);
    if (update.classLevel)
        contextClass.setModelMeta(decorators_key_constant_1.DECORATOR_KEYS.NOT_IGNORE_KEY, instanceNotIgnored);
}
exports.removeFieldsFromIgnored = removeFieldsFromIgnored;
function getIgnoredFields(contextClass) {
    const classSet = new Set(getClassIgnoredFields(contextClass));
    const instanceSet = getInstanceIgnoredFields(contextClass);
    const notIgnored = getInstanceNotIgnoredFields(contextClass);
    Array.from(notIgnored).forEach(field => classSet.delete(field));
    const arr = Array.from(classSet);
    arr.push.apply(arr, Array.from(instanceSet));
    return arr;
}
exports.getIgnoredFields = getIgnoredFields;
function initInstanceIgnoredFields(contextClass) {
    contextClass.deleteModelMeta(decorators_key_constant_1.DECORATOR_KEYS.IGNORE_KEY);
    contextClass.deleteModelMeta(decorators_key_constant_1.DECORATOR_KEYS.NOT_IGNORE_KEY);
}
exports.initInstanceIgnoredFields = initInstanceIgnoredFields;
function getClassIgnoredFields(contextClass) {
    return "getModelMeta" in contextClass.constructor
        ? contextClass.constructor.getModelMeta(decorators_key_constant_1.DECORATOR_KEYS.IGNORE_KEY) || new Set()
        : null;
}
function getInstanceIgnoredFields(contextClass) {
    return contextClass.hasModelMeta(decorators_key_constant_1.DECORATOR_KEYS.IGNORE_KEY)
        ? contextClass.getModelMeta(decorators_key_constant_1.DECORATOR_KEYS.IGNORE_KEY)
        : new Set();
}
function getInstanceNotIgnoredFields(contextClass) {
    return contextClass.hasModelMeta(decorators_key_constant_1.DECORATOR_KEYS.NOT_IGNORE_KEY)
        ? contextClass.getModelMeta(decorators_key_constant_1.DECORATOR_KEYS.NOT_IGNORE_KEY)
        : new Set();
}
