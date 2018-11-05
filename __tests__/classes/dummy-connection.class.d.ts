import { IConnection, CONNECTION_STATUS } from "../../index";
export declare class DummyConnection implements IConnection {
    port: number;
    hostName: string;
    status: CONNECTION_STATUS;
    connectionClient: any;
    connectionName?: string;
    user?: string;
    password?: string;
    authDB?: string;
    connect(): Promise<boolean>;
    disconnect(): Promise<boolean>;
    isConnected(): Promise<boolean>;
    getConnectionString(): string;
}
