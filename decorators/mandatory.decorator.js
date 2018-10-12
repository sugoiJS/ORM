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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFuZGF0b3J5LmRlY29yYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2RlY29yYXRvcnMvbWFuZGF0b3J5LmRlY29yYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGtGQUFvRTtBQWNwRSxTQUFnQixRQUFRLENBQUMsWUFBMkMsS0FBSztJQUNyRSxPQUFPLFVBQVUsWUFBdUIsRUFDdkIsV0FBbUI7UUFFaEMsaUJBQWlCLENBQUMsWUFBWSxFQUFFLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUM1RCxDQUFDLENBQUE7QUFDTCxDQUFDO0FBTkQsNEJBTUM7QUFFRCxTQUFnQixrQkFBa0IsQ0FBQyxZQUFZO0lBQzNDLElBQUksQ0FBQyxDQUFDLFlBQVksSUFBSSxPQUFPLENBQUMsV0FBVyxDQUFDLHdDQUFjLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQyxDQUFDLEVBQUU7UUFDcEYsT0FBTyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztLQUNyRjtJQUNELE9BQU8sT0FBTyxDQUFDLFdBQVcsQ0FBQyx3Q0FBYyxDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUMzRSxDQUFDO0FBTEQsZ0RBS0M7QUFFRCxTQUFnQix5QkFBeUIsQ0FBQyxZQUF1QixFQUFFLFFBQWdCLEVBQUUsU0FBeUM7SUFDMUgsTUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFDLDBCQUEwQixFQUFFLENBQUM7SUFDekQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksYUFBYSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMxRCxPQUFPLFlBQVksQ0FBQyxZQUFZLENBQUMsd0NBQWMsQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUE7QUFDMUUsQ0FBQztBQUpELDhEQUlDO0FBRUQsU0FBUyxpQkFBaUIsQ0FBQyxZQUF1QixFQUFFLFFBQWdCLEVBQUUsU0FBVTtJQUM1RSxNQUFNLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDdEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksYUFBYSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMxRCxPQUFPLENBQUMsY0FBYyxDQUFDLHdDQUFjLENBQUMsYUFBYSxFQUFFLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztBQUMvRSxDQUFDO0FBRUQsTUFBTSxhQUFhO0lBSWYsWUFBbUIsS0FBYSxFQUFFLFNBQXlDO1FBQXhELFVBQUssR0FBTCxLQUFLLENBQVE7UUFDNUIsSUFBSSxTQUFTLEtBQUssU0FBUztZQUFFLE9BQU87YUFDL0IsSUFBSSxPQUFPLFNBQVMsS0FBSyxTQUFTLEVBQUU7WUFDckMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFNBQVMsQ0FBQztTQUNyQzthQUNJO1lBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7U0FDOUI7SUFDTCxDQUFDO0NBQ0oifQ==