export interface IAfterUpdate{
    afterUpdate(updateResponse?):Promise<any> | void
}