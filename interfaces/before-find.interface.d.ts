import { QueryOptions } from "../classes/query-options.class";
export interface IBeforeFind {
    beforeFind(query: any, options?: Partial<QueryOptions | any>): Promise<any> | void;
}
