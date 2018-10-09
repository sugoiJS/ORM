export interface IAfterRemove {
    afterRemove(res: any): Promise<any> | void;
}
