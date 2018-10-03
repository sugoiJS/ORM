import {IConnection, CONNECTION_STATUS} from "../../index";

export class DummyConnection implements IConnection {
    port: number;
    hostName: string;
    status: CONNECTION_STATUS;
    connectionClient: any;
    connectionName?: string;
    user?: string;
    password?: string;
    authDB?: string;


    getConnectionString(): string {
        let connectionString: string = "";
        if (this.user && this.password)
            connectionString += `${this.user}:${this.password}@`;
        connectionString += `${this.hostName}:${this.port}`;
        if (this.authDB)
            connectionString += `/${this.authDB}`;
        return connectionString;
    }

    disconnect(): Promise<boolean> {
        console.log("disconnect");
        this.status = CONNECTION_STATUS.DISCONNECTED;
        return Promise.resolve(true)
    }

    connect(): Promise<boolean> {
        if (this.getConnectionString().trim() !== ":") {
            return Promise.resolve(false);
        }
        this.connectionClient = {
            disconnect: (function(){
                return this.disconnect();
            }).bind(this)
        };
        this.status = CONNECTION_STATUS.CONNECTED;
        return Promise.resolve(true);
    }

    isConnected(): Promise<boolean> {
        return Promise.resolve(this.status === CONNECTION_STATUS.CONNECTED);
    }

}
