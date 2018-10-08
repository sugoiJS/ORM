import { CONNECTION_STATUS } from "../constants/connection-status.constant";
export interface IConnection {
    port: number;
    hostName: string;
    status: CONNECTION_STATUS;
    db?: string;
    connectionName?: string;
    user?: string;
    password?: string;
    authDB?: string;
    connectionClient: any;
    connect(): Promise<boolean>;
    disconnect(): Promise<boolean>;
    isConnected(): Promise<boolean>;
    getConnectionString(): string;
}
