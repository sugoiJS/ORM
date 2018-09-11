import {SugoiModelException} from "../exceptions/model.exception";
import {EXCEPTIONS} from "../constants/exceptions.contant";

export function ConnectionName(name:string){
    return function (classInstance: any) {
        if(!setConnectionName(classInstance,name)){
            throw new SugoiModelException(EXCEPTIONS.NOT_EXTEND_CONNECTABLE_MODEL.message,EXCEPTIONS.NOT_EXTEND_CONNECTABLE_MODEL.code)
        }
    }
}

function setConnectionName(classInstance:any,name:string) {
    if ("setConnectionName" in classInstance) {
        classInstance.setConnectionName(name);
        return true;
    }
    else if (!!classInstance.prototype){
        return setConnectionName(classInstance.prototype,name);
    }
    else{
        return false
    }
}