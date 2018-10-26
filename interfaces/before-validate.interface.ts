import {QueryOptions} from "../classes/query-options.class";

export interface IBeforeValidate{
    beforeValidate(options?:Partial<QueryOptions|any>):Promise<any> | void
}