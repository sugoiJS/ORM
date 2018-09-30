export interface IAfterUpdate {
    afterUpdate(updateResponse?: any): Promise<any> | void;
}
