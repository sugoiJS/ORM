import { Storeable } from "../classes/storeable.class";
/**
 * Set property as primary key.
 * This key is use later to query, update and remove models.
 *
 * @returns {(contextClassInstance: Storeable, propertyKey: string) => void}
 * @constructor
 */
export declare function Ignore(): (contextClassInstance: any, propertyKey: string) => void;
/**
 * add ignored fields to the list
 * @param {ModelAbstract} contextClass
 * @param {string} fields
 */
export declare function addIgnoredFields(contextClass: typeof Storeable, ...fields: string[]): any;
export declare function addIgnoredFields(contextClass: Storeable, ...fields: string[]): any;
export declare function removeFieldsFromIgnored(contextClass: Storeable, ...fields: string[]): void;
export declare function getIgnoredFields(contextClass: Storeable | typeof Storeable): string[];
export declare function initInstanceIgnoredFields(contextClass: Storeable | typeof Storeable): void;
