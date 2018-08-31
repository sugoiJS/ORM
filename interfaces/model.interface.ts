export interface IModel {
    update<T=any>(options?: any): Promise<T>;
    save<T=any>(options?: any): Promise<T>;
}