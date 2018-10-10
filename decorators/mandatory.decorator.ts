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

        addMandatoryField(contextClass, propertyKey, condition);
    }
}

export function getMandatoryFields(contextClass): { [prop: string]: MandatoryItem } {
    if (!(contextClass && Reflect.hasMetadata(DECORATOR_KEYS.MANDATORY_KEY, contextClass))) {
        return contextClass.prototype ? getMandatoryFields(contextClass.prototype) : null;
    }
    return Reflect.getMetadata(DECORATOR_KEYS.MANDATORY_KEY, contextClass);
}

export function addInstanceMandatoryField(contextClass: Storeable, property: string, condition?: ComparableValueType | boolean) {
    const fields = contextClass.getInstanceMandatoryFields();
    fields[property] = new MandatoryItem(property, condition);
    return contextClass.setModelMeta(DECORATOR_KEYS.MANDATORY_KEY, fields)
}

function addMandatoryField(contextClass: Storeable, property: string, condition?) {
    const fields = getMandatoryFields(contextClass) || {};
    fields[property] = new MandatoryItem(property, condition);
    Reflect.defineMetadata(DECORATOR_KEYS.MANDATORY_KEY, fields, contextClass);
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