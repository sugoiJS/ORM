import {DECORATOR_KEYS} from "../constants/decorators-key.constant";

export function Primary() {
    return function (contextClass: any,
                     propertyKey: string): void {
        Reflect.defineMetadata(DECORATOR_KEYS.PRIMARY_KEY, propertyKey,contextClass);
    }
}

export function getPrimaryKey(contextClass){
    if(!(contextClass && Reflect.hasMetadata(DECORATOR_KEYS.PRIMARY_KEY,contextClass)))
        return contextClass.prototype ? getPrimaryKey(contextClass.prototype) : null;
    return Reflect.getMetadata(DECORATOR_KEYS.PRIMARY_KEY, contextClass);
}