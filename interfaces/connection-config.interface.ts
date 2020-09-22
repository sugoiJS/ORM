
export interface IConnectionConfig{
    port: number;
    hostName: string;
    db?: string;
    user?:string;
    password?:string;
    authDB?:string;
}