export interface IBeforeUpdate {
    beforeUpdate(): Promise<any> | void;
}
