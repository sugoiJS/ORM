import {QueryOptions} from "../classes/query-options.class";

export interface IModel {
    save<T=any>(options?: QueryOptions): Promise<T>;
    update<T=any>(options?: QueryOptions): Promise<T>;
    remove<T=any>(options?: QueryOptions): Promise<T>;
}