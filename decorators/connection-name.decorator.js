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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGlvbi1uYW1lLmRlY29yYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2RlY29yYXRvcnMvY29ubmVjdGlvbi1uYW1lLmRlY29yYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1FQUFrRTtBQUNsRSx3RUFBMkQ7QUFFM0QsU0FBZ0IsY0FBYyxDQUFDLElBQVc7SUFDdEMsT0FBTyxVQUFVLGFBQWtCO1FBQy9CLElBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEVBQUMsSUFBSSxDQUFDLEVBQUM7WUFDdEMsTUFBTSxJQUFJLHFDQUFtQixDQUFDLCtCQUFVLENBQUMsNEJBQTRCLENBQUMsT0FBTyxFQUFDLCtCQUFVLENBQUMsNEJBQTRCLENBQUMsSUFBSSxDQUFDLENBQUE7U0FDOUg7SUFDTCxDQUFDLENBQUE7QUFDTCxDQUFDO0FBTkQsd0NBTUM7QUFFRCxTQUFTLGlCQUFpQixDQUFDLGFBQWlCLEVBQUMsSUFBVztJQUNwRCxJQUFJLG1CQUFtQixJQUFJLGFBQWEsRUFBRTtRQUN0QyxhQUFhLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEMsT0FBTyxJQUFJLENBQUM7S0FDZjtTQUNJLElBQUksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUM7UUFDL0IsT0FBTyxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFDLElBQUksQ0FBQyxDQUFDO0tBQzFEO1NBQ0c7UUFDQSxPQUFPLEtBQUssQ0FBQTtLQUNmO0FBQ0wsQ0FBQyJ9