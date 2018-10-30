import { Storeable } from "../classes/storeable.class";
/**
 * Set property as ignored.
 * This key won't be used during parsing, storing and response.
 *
 * @returns {(contextClassInstance: Storeable, propertyKey: string) => void}
 * @constructor
 */
export declare function Ignore(): (contextClassInstance: Storeable, propertyKey: string) => void;
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
