export interface IAfterSave {
    afterSave(saveResponse?):Promise<any> | void
}