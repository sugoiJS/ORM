import { Storeable } from "../classes/storeable.class";
import { ComparableValueType } from "@sugoi/core/dist/policies/interfaces/comparable-value.interface";
/**
 * Set property as Required so it will be validate before upsert.
 *
 * @returns {(contextClassInstance: Storeable, propertyKey: string) => void}
 * @constructor
 */
export declare function Required(): any;
export declare function Required(condition: ComparableValueType): any;
export declare function Required(allowEmptyString: boolean): any;
export declare function getMandatoryFields(contextClass: any): {
    [prop: string]: MandatoryItem;
};
export declare function addInstanceMandatoryField(contextClass: Storeable, property: string, condition?: ComparableValueType | boolean): void;
declare class MandatoryItem {
    field: string;
    condition: any;
    allowEmptyString: any;
    constructor(field: string, condition?: boolean | ComparableValueType);
}
export {};
