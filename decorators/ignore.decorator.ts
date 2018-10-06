import {DECORATOR_KEYS} from "../constants/decorators-key.constant";
import {Storeable} from "../classes/storeable.class";


/**
 * Set property as primary key.
 * This key is use later to query, update and remove models.
 *
 * @returns {(contextClassInstance: Storeable, propertyKey: string) => void}
 * @constructor
 */
export function Ignore() {
    return function (contextClassInstance: any,
                     propertyKey: string): void {
        const contextClass = (<typeof Storeable>contextClassInstance.constructor);
        addIgnoredFields(contextClass, propertyKey);
    }
}


/**
 * add ignored fields to the list
 * @param {ModelAbstract} contextClass
 * @param {string} fields
 */
export function addIgnoredFields(contextClass: typeof Storeable, ...fields: string[])
export function addIgnoredFields(contextClass: Storeable, ...fields: string[])
export function addIgnoredFields(contextClass: typeof Storeable | Storeable, ...fields: string[]) {
    const ignoredFields = getInstanceIgnoredFields(contextClass) || new Set();
    const classFields = getClassIgnoredFields(contextClass);
    fields.forEach(field => {
        if (classFields && classFields.has(field)) return;
        ignoredFields.add(field)
    });
    contextClass.setModelMeta(DECORATOR_KEYS.IGNORE_KEY, new Set(ignoredFields))
}

export function removeFieldsFromIgnored(contextClass: Storeable, ...fields: string[]) {
    const instanceFields = getInstanceIgnoredFields(contextClass);
    const classFields = getClassIgnoredFields(contextClass);
    const instanceNotIgnored = getInstanceNotIgnoredFields(contextClass);
    const update = {instance: false, classLevel: false};
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
        contextClass.setModelMeta(DECORATOR_KEYS.IGNORE_KEY, instanceFields);
    if (update.classLevel)
        contextClass.setModelMeta(DECORATOR_KEYS.NOT_IGNORE_KEY, instanceNotIgnored);

}

export function getIgnoredFields(contextClass: Storeable | typeof Storeable): string[] {
    const classSet = new Set(getClassIgnoredFields(contextClass));
    const instanceSet = getInstanceIgnoredFields(contextClass);
    const notIgnored = getInstanceNotIgnoredFields(contextClass);
    Array.from(notIgnored).forEach(field => classSet.delete(field));
    const arr = Array.from(classSet);
    arr.push.apply(arr, Array.from(instanceSet));
    return arr;
}

export function initInstanceIgnoredFields(contextClass: Storeable | typeof Storeable): void{
    contextClass.deleteModelMeta(DECORATOR_KEYS.IGNORE_KEY);
    contextClass.deleteModelMeta(DECORATOR_KEYS.NOT_IGNORE_KEY);
}

function getClassIgnoredFields(contextClass: Storeable | typeof Storeable): Set<string> {
    return "getModelMeta" in (<typeof Storeable>contextClass.constructor)
        ? (<typeof Storeable>contextClass.constructor).getModelMeta(DECORATOR_KEYS.IGNORE_KEY) || new Set()
        : null;
}

function getInstanceIgnoredFields(contextClass: Storeable | typeof Storeable): Set<string> {
    return contextClass.hasModelMeta(DECORATOR_KEYS.IGNORE_KEY)
        ? contextClass.getModelMeta(DECORATOR_KEYS.IGNORE_KEY)
        : new Set();
}

function getInstanceNotIgnoredFields(contextClass: Storeable | typeof Storeable): Set<string> {
    return contextClass.hasModelMeta(DECORATOR_KEYS.NOT_IGNORE_KEY)
        ? contextClass.getModelMeta(DECORATOR_KEYS.NOT_IGNORE_KEY)
        : new Set();
}