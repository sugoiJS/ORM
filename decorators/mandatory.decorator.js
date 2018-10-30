"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_key_constant_1 = require("../constants/decorators-key.constant");
function Required(condition = false) {
    return function (contextClass, propertyKey) {
        addMandatoryField(contextClass, propertyKey, condition);
    };
}
exports.Required = Required;
function getMandatoryFields(contextClass) {
    if (!(contextClass && Reflect.hasMetadata(decorators_key_constant_1.DECORATOR_KEYS.MANDATORY_KEY, contextClass))) {
        return contextClass.prototype ? getMandatoryFields(contextClass.prototype) : null;
    }
    return Reflect.getMetadata(decorators_key_constant_1.DECORATOR_KEYS.MANDATORY_KEY, contextClass);
}
exports.getMandatoryFields = getMandatoryFields;
function addInstanceMandatoryField(contextClass, property, condition) {
    const fields = contextClass.getInstanceMandatoryFields();
    fields[property] = new MandatoryItem(property, condition);
    return contextClass.setModelMeta(decorators_key_constant_1.DECORATOR_KEYS.MANDATORY_KEY, fields);
}
exports.addInstanceMandatoryField = addInstanceMandatoryField;
function addMandatoryField(contextClass, property, condition) {
    const fields = getMandatoryFields(contextClass) || {};
    fields[property] = new MandatoryItem(property, condition);
    Reflect.defineMetadata(decorators_key_constant_1.DECORATOR_KEYS.MANDATORY_KEY, fields, contextClass);
}
class MandatoryItem {
    constructor(field, condition) {
        this.field = field;
        if (condition === undefined)
            return;
        else if (typeof condition === "boolean") {
            this.allowEmptyString = condition;
        }
        else {
            this.condition = condition;
        }
    }
}
