export interface IAfterSave {
    afterSave():Promise<any> | void
}