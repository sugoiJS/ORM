import { ModelAbstract } from "./model.abstract";
import { IConnectionConfig } from "../interfaces/connection-config.interface";
import { IConnection } from "../interfaces/connection.interface";
import { Connection } from "../classes/connection.class";
export declare abstract class ConnectableModel extends ModelAbstract {
    protected static connections: Map<string, IConnection>;
    protected static connectionName: string;
    static setConnection(configData: IConnectionConfig, connectionName?: string): Promise<IConnection>;
    static setConnection(configData: IConnectionConfig, connectionClass: string | typeof Connection, connectionName?: string): Promise<IConnection>;
    static getConnection(connectionName?: string): IConnection;
    static setConnectionName(connectionName?: string): void;
    static getConnectionName(): string;
    static connect(connectionName?: string): Promise<IConnection>;
    static disconnect(connectionName?: string): Promise<boolean>;
}
