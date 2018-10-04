import {ModelAbstract} from "./model.abstract";
import {IConnectionConfig} from "../interfaces/connection-config.interface";
import {SugoiModelException} from "../exceptions/model.exception";
import {EXCEPTIONS} from "../constants/exceptions.contant";
import {IConnection} from "../interfaces/connection.interface";
import {clone} from "../utils/object.utils";
import {CONNECTION_STATUS} from "../constants/connection-status.constant";

export abstract class ConnectableModel extends ModelAbstract {
    protected static connections: Map<string, IConnection> = new Map();

    protected static connectionName: string = "default";

    public static setConnection(configData: IConnectionConfig,connectionClass, connectionName: string = "default"): Promise<IConnection> {
        if (!connectionClass)
            throw new SugoiModelException(EXCEPTIONS.CONNECTABLE_CONNECTION_NOT_CONFIGURED.message, EXCEPTIONS.CONNECTABLE_CONNECTION_NOT_CONFIGURED.code, this.name);
        configData['connectionName'] = connectionName;
        const connection = clone(connectionClass, configData) as IConnection;
        connection.status = CONNECTION_STATUS.DISCONNECTED;
        this.connections.set(connectionName, connection);
        return this.connect(connectionName);

    }

    public static getConnection(connectionName: string = this.getConnectionName()): IConnection {
        return this.connections.has(connectionName)
            ? this.connections.get(connectionName)
            : null;
    }

    public static setConnectionName(connectionName: string = "default"): void {
        this.connectionName = connectionName;
    }

    public static getConnectionName(): string {
        return this.connectionName;
    }

    public static async connect(connectionName: string = this.getConnectionName()): Promise<IConnection> {
        const connection = this.connections.get(connectionName);
        if (!connection) {
            throw new SugoiModelException(EXCEPTIONS.CONFIGURATION_MISSING.message, EXCEPTIONS.CONFIGURATION_MISSING.code);
        }

        if (await connection.isConnected()) {
            return Promise.resolve(connection);
        } else {
            return connection.connect()
                .then(() => connection)
                .catch(async err => {
                    console.error(err);
                    try {
                        await connection.disconnect();
                    } catch (err) {
                    }
                    throw err;
                });

        }
    }

    public static disconnect(connectionName?: string) {
        const connection = this.getConnection(connectionName);
        return !!connection
            ? connection.disconnect()
            : null
    }
}