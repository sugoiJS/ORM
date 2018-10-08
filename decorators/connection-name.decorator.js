"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_exception_1 = require("../exceptions/model.exception");
const exceptions_contant_1 = require("../constants/exceptions.contant");
function ConnectionName(name) {
    return function (classInstance) {
        if (!setConnectionName(classInstance, name)) {
            throw new model_exception_1.SugoiModelException(exceptions_contant_1.EXCEPTIONS.NOT_EXTEND_CONNECTABLE_MODEL.message, exceptions_contant_1.EXCEPTIONS.NOT_EXTEND_CONNECTABLE_MODEL.code);
        }
    };
}
exports.ConnectionName = ConnectionName;
function setConnectionName(classInstance, name) {
    if ("setConnectionName" in classInstance) {
        classInstance.setConnectionName(name);
        return true;
    }
    else if (!!classInstance.prototype) {
        return setConnectionName(classInstance.prototype, name);
    }
    else {
        return false;
    }
}
