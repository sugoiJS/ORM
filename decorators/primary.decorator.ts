import {DECORATOR_KEYS} from "../constants/decorators-key.constant";


/**
 * Set property as primary key.
 * This key is use later to query, update and remove models.
 *
 * @returns {(contextClass: any, propertyKey: string) => void}
 * @constructor
 */
export function Primary() {
    return function (contextClass: any,
                     propertyKey: string): void {
        Reflect.defineMetadata(DECORATOR_KEYS.PRIMARY_KEY, propertyKey, contextClass);
    }
}


/**
 * Get primary key of certain class.
 * In case the class doesn't have primary key the function will check recursivly at the parent class
 *
 * @param contextClass
 * @returns {string | null}
 */
export function getPrimaryKey(contextClass): string | null {
    if (!(contextClass && Reflect.hasMetadata(DECORATOR_KEYS.PRIMARY_KEY, contextClass))){
        return contextClass.prototype ? getPrimaryKey(contextClass.prototype) : null;
    }
    return Reflect.getMetadata(DECORATOR_KEYS.PRIMARY_KEY, contextClass);
}