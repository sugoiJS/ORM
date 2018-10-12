import { QueryOptions } from "../classes/query-options.class";
export interface IBeforeRemove {
    beforeRemove(query: any, options?: Partial<QueryOptions | any>): Promise<any> | void;
}
