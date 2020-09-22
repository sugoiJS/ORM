export interface IValidate{
    /**
     * return true whenever valid, otherwise considered as invalid value
     * returned value use as error message data
     * @returns {boolean | any}
     */
    validate():Promise<true|any>
}