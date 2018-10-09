"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_key_constant_1 = require("../constants/decorators-key.constant");
/**
 * Set property as primary key.
 * This key is use later to query, update and remove models.
 *
 * @returns {(contextClass: any, propertyKey: string) => void}
 * @constructor
 */
function Primary() {
    return function (contextClass, propertyKey) {
        Reflect.defineMetadata(decorators_key_constant_1.DECORATOR_KEYS.PRIMARY_KEY, propertyKey, contextClass);
    };
}
exports.Primary = Primary;
/**
 * Get primary key of certain class.
 * In case the class doesn't have primary key the function will check recursivly at the parent class
 *
 * @param contextClass
 * @returns {string | null}
 */
function getPrimaryKey(contextClass) {
    if (!(contextClass && Reflect.hasMetadata(decorators_key_constant_1.DECORATOR_KEYS.PRIMARY_KEY, contextClass))) {
        return contextClass.prototype ? getPrimaryKey(contextClass.prototype) : null;
    }
    return Reflect.getMetadata(decorators_key_constant_1.DECORATOR_KEYS.PRIMARY_KEY, contextClass);
}
exports.getPrimaryKey = getPrimaryKey;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpbWFyeS5kZWNvcmF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9kZWNvcmF0b3JzL3ByaW1hcnkuZGVjb3JhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0ZBQW9FO0FBR3BFOzs7Ozs7R0FNRztBQUNILFNBQWdCLE9BQU87SUFDbkIsT0FBTyxVQUFVLFlBQWlCLEVBQ2pCLFdBQW1CO1FBQ2hDLE9BQU8sQ0FBQyxjQUFjLENBQUMsd0NBQWMsQ0FBQyxXQUFXLEVBQUUsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ2xGLENBQUMsQ0FBQTtBQUNMLENBQUM7QUFMRCwwQkFLQztBQUdEOzs7Ozs7R0FNRztBQUNILFNBQWdCLGFBQWEsQ0FBQyxZQUFZO0lBQ3RDLElBQUksQ0FBQyxDQUFDLFlBQVksSUFBSSxPQUFPLENBQUMsV0FBVyxDQUFDLHdDQUFjLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDLEVBQUM7UUFDakYsT0FBTyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7S0FDaEY7SUFDRCxPQUFPLE9BQU8sQ0FBQyxXQUFXLENBQUMsd0NBQWMsQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDekUsQ0FBQztBQUxELHNDQUtDIn0=