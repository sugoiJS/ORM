export interface IAfterFind {
    afterFind(res: any): Promise<any> | void;
}
