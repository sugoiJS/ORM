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


    connect(): Promise<boolean> {
        if (this.getConnectionString().trim() === ":") {
            return Promise.resolve(false);
        }
        this.connectionClient = {
            disconnect: ()=>Promise.resolve(true)
        };
        this.status = CONNECTION_STATUS.CONNECTED;
        return Promise.resolve(true);
    }

    disconnect(): Promise<boolean> {
        console.log("disconnect");
        return this.connectionClient.disconnect()
            .then(()=>{
                this.status = CONNECTION_STATUS.DISCONNECTED;
                return true;
            });
    }

    isConnected(): Promise<boolean> {
        return Promise.resolve(this.status === CONNECTION_STATUS.CONNECTED);
    }

    getConnectionString(): string {
        let connectionString: string = "";
        if (this.user && this.password)
            connectionString += `${this.user}:${this.password}@`;
        connectionString += `${this.hostName||""}:${this.port||""}`;
        if (this.authDB)
            connectionString += `/${this.authDB}`;
        return connectionString;
    }

}
