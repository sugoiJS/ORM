import {IConnection} from "../interfaces/connection.interface";
import {CONNECTION_STATUS} from "../constants/connection-status.constant";

export abstract class Connection implements IConnection{
    port: number;
    hostName: string;
    status: CONNECTION_STATUS;
    connectionClient: any;

    abstract connect(): Promise<boolean>;

    abstract disconnect(): Promise<boolean>;

    abstract isConnected(): Promise<boolean>;

    abstract getConnectionString(): string;
}