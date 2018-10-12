"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_key_constant_1 = require("../constants/decorators-key.constant");
/**
 * Set property as ignored.
 * This key won't be used during parsing, storing and response.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWdub3JlLmRlY29yYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2RlY29yYXRvcnMvaWdub3JlLmRlY29yYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGtGQUFvRTtBQUlwRTs7Ozs7O0dBTUc7QUFDSCxTQUFnQixNQUFNO0lBQ2xCLE9BQU8sVUFBVSxvQkFBK0IsRUFDL0IsV0FBbUI7UUFDaEMsTUFBTSxZQUFZLEdBQXNCLG9CQUFvQixDQUFDLFdBQVksQ0FBQztRQUMxRSxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDaEQsQ0FBQyxDQUFBO0FBQ0wsQ0FBQztBQU5ELHdCQU1DO0FBVUQsU0FBZ0IsZ0JBQWdCLENBQUMsWUFBMEMsRUFBRSxHQUFHLE1BQWdCO0lBQzVGLE1BQU0sYUFBYSxHQUFHLHdCQUF3QixDQUFDLFlBQVksQ0FBQyxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7SUFDMUUsTUFBTSxXQUFXLEdBQUcscUJBQXFCLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDeEQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNuQixJQUFJLFdBQVcsSUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztZQUFFLE9BQU87UUFDbEQsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUM1QixDQUFDLENBQUMsQ0FBQztJQUNILFlBQVksQ0FBQyxZQUFZLENBQUMsd0NBQWMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQTtBQUNoRixDQUFDO0FBUkQsNENBUUM7QUFFRCxTQUFnQix1QkFBdUIsQ0FBQyxZQUF1QixFQUFFLEdBQUcsTUFBZ0I7SUFDaEYsTUFBTSxjQUFjLEdBQUcsd0JBQXdCLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDOUQsTUFBTSxXQUFXLEdBQUcscUJBQXFCLENBQUMsWUFBWSxDQUFD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