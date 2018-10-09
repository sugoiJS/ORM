/**
 * Set property as primary key.
 * This key is use later to query, update and remove models.
 *
 * @returns {(contextClass: any, propertyKey: string) => void}
 * @constructor
 */
export declare function Primary(): (contextClass: any, propertyKey: string) => void;
/**
 * Get primary key of certain class.
 * In case the class doesn't have primary key the function will check recursivly at the parent class
 *
 * @param contextClass
 * @returns {string | null}
 */
export declare function getPrimaryKey(contextClass: any): string | null;
