import {SugoiModelException} from "../exceptions/model.exception";
import {EXCEPTIONS} from "../constants/exceptions.contant";

export function ModelName(name:string){
    return function (classInstance: any) {
        if(!setCollectionName(classInstance,name)){
            throw new SugoiModelException(EXCEPTIONS.NOT_EXTEND_MODEL.message,EXCEPTIONS.NOT_EXTEND_MODEL.code)
        }
    }
}

function setCollectionName(classInstance:any,name:string) {
    if ("setCollectionName" in classInstance) {
        classInstance.setCollectionName(name);
        return true;
    }
    else if (!!classInstance.prototype){
        return setCollectionName(classInstance.prototype,name);
    }
    else{
        return false
    }
}