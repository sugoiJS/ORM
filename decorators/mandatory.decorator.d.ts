import { Storeable } from "../classes/storeable.class";
import { TComparableSchema } from "@sugoi/core";
/**
 * Set property as Required so it will be validate before upsert.
 *
 * @returns {(contextClassInstance: Storeable, propertyKey: string) => void}
 * @constructor
 */
export declare function Required(): any;
export declare function Required(condition: TComparableSchema): any;
export declare function Required(allowEmptyString: boolean): any;
export declare function getMandatoryFields(contextClass: any): {
    [prop: string]: MandatoryItem;
};
export declare function addInstanceMandatoryField(contextClass: Storeable, property: string, condition?: TComparableSchema | boolean): void;
declare class MandatoryItem {
    field: string;
    condition: any;
    allowEmptyString: any;
    constructor(field: string, condition?: boolean | TComparableSchema);
}
export {};
