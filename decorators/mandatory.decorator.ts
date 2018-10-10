import {DECORATOR_KEYS} from "../constants/decorators-key.constant";
import {Storeable} from "../classes/storeable.class";
import {ComparableValueType} from "@sugoi/core/dist/policies/interfaces/comparable-value.interface";


/**
 * Set property as Mandatory so it will be validate before upsert.
 *
 * @returns {(contextClassInstance: Storeable, propertyKey: string) => void}
 * @constructor
 */
export function Mandatory();
export function Mandatory(condition: ComparableValueType);
export function Mandatory(allowEmptyString: boolean);
export function Mandatory(condition: boolean | ComparableValueType = false) {
    return function (contextClass: Storeable,
                     propertyKey: string): void {

        const fields = getMandatoryFields(contextClass) || {};
        fields[propertyKey] = new MandatoryItem(propertyKey, condition);
        Reflect.defineMetadata(DECORATOR_KEYS.MANDATORY_KEY, fields, contextClass);
    }
}

export function getMandatoryFields(contextClass): {[prop:string]: MandatoryItem} {
    if (!(contextClass && Reflect.hasMetadata(DECORATOR_KEYS.MANDATORY_KEY, contextClass))) {
        return contextClass.prototype ? getMandatoryFields(contextClass.prototype) : null;
    }
    return Reflect.getMetadata(DECORATOR_KEYS.MANDATORY_KEY, contextClass);
}

class MandatoryItem {
    public condition;
    public allowEmptyString;

    constructor(public field: string, condition?: boolean | ComparableValueType) {
        if (condition === undefined) return;
        else if (typeof condition === "boolean") {
            this.allowEmptyString = condition;
        }
        else {
            this.condition = condition;
        }
    }
}