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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwtbmFtZS5kZWNvcmF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9kZWNvcmF0b3JzL21vZGVsLW5hbWUuZGVjb3JhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUVBQWtFO0FBQ2xFLHdFQUEyRDtBQUUzRCxTQUFnQixTQUFTLENBQUMsSUFBVztJQUNqQyxPQUFPLFVBQVUsYUFBa0I7UUFDL0IsSUFBRyxDQUFDLGlCQUFpQixDQUFDLGFBQWEsRUFBQyxJQUFJLENBQUMsRUFBQztZQUN0QyxNQUFNLElBQUkscUNBQW1CLENBQUMsK0JBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUMsK0JBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQTtTQUN0RztJQUNMLENBQUMsQ0FBQTtBQUNMLENBQUM7QUFORCw4QkFNQztBQUVELFNBQVMsaUJBQWlCLENBQUMsYUFBaUIsRUFBQyxJQUFXO0lBQ3BELElBQUksbUJBQW1CLElBQUksYUFBYSxFQUFFO1FBQ3RDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QyxPQUFPLElBQUksQ0FBQztLQUNmO1NBQ0ksSUFBSSxDQUFDLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBQztRQUMvQixPQUFPLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUMsSUFBSSxDQUFDLENBQUM7S0FDMUQ7U0FDRztRQUNBLE9BQU8sS0FBSyxDQUFBO0tBQ2Y7QUFDTCxDQUFDIn0=