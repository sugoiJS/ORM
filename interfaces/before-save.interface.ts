export interface IBeforeSave{
    beforeSave():Promise<any>|void
}