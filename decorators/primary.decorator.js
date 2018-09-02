"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var decorators_key_constant_1 = require("../constants/decorators-key.constant");
/**
 * Set property as primary key.
 * This key is use later to query, update and remove models.
 *
 * @returns {(contextClass: any, propertyKey: string) => void}
 * @constructor
 */
function Primary() {
    return function (contextClass, propertyKey) {
        Reflect.defineMetadata(decorators_key_constant_1.DECORATOR_KEYS.PRIMARY_KEY, propertyKey, contextClass);
    };
}
exports.Primary = Primary;
/**
 * Get primary key of certain class.
 * In case the class doesn't have primary key the function will check recursivly at the parent class
 *
 * @param contextClass
 * @returns {string | null}
 */
function getPrimaryKey(contextClass) {
    if (!(contextClass && Reflect.hasMetadata(decorators_key_constant_1.DECORATOR_KEYS.PRIMARY_KEY, contextClass))) {
        return contextClass.prototype ? getPrimaryKey(contextClass.prototype) : null;
    }
    return Reflect.getMetadata(decorators_key_constant_1.DECORATOR_KEYS.PRIMARY_KEY, contextClass);
}
exports.getPrimaryKey = getPrimaryKey;
