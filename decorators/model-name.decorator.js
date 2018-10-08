"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_exception_1 = require("../exceptions/model.exception");
const exceptions_contant_1 = require("../constants/exceptions.contant");
function ModelName(name) {
    return function (classInstance) {
        if (!setCollectionName(classInstance, name)) {
            throw new model_exception_1.SugoiModelException(exceptions_contant_1.EXCEPTIONS.NOT_EXTEND_MODEL.message, exceptions_contant_1.EXCEPTIONS.NOT_EXTEND_MODEL.code);
        }
    };
}
exports.ModelName = ModelName;
function setCollectionName(classInstance, name) {
    if ("setCollectionName" in classInstance) {
        classInstance.setCollectionName(name);
        return true;
    }
    else if (!!classInstance.prototype) {
        return setCollectionName(classInstance.prototype, name);
    }
    else {
        return false;
    }
}
