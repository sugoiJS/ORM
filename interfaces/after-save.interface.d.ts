export interface IAfterSave {
    afterSave(saveResponse?: any): Promise<any> | void;
}
