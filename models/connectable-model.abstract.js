"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_abstract_1 = require("./model.abstract");
const connection_class_1 = require("../classes/connection.class");
const connection_status_constant_1 = require("../constants/connection-status.constant");
const model_exception_1 = require("../exceptions/model.exception");
const exceptions_contant_1 = require("../constants/exceptions.contant");
class ConnectableModel extends model_abstract_1.ModelAbstract {
    constructor() {
        super();
    }
    static setConnection(configData, connectionName = "default") {
        configData.connectionName = connectionName;
        const connection = this.ConnectionType.clone(configData);
        this.connections.set(connectionName, connection);
        return this.connect(connectionName);
    }
    static getConnection(connectionName = "default") {
        return this.connections.has(connectionName)
            ? this.connections.get(connectionName)
            : null;
    }
    static setConnectionName(connectionName = "default") {
        this.connectionName = connectionName;
    }
    static getConnectionName() {
        return this.connectionName;
    }
    static connect(connectionName = this.getConnectionName()) {
        const connection = this.connections.get(connectionName);
        if (!connection) {
            throw new model_exception_1.SugoiModelException(exceptions_contant_1.EXCEPTIONS.CONFIGURATION_MISSING.message, exceptions_contant_1.EXCEPTIONS.CONFIGURATION_MISSING.code);
        }
        if (connection.isConnected()) {
            return Promise.resolve(connection.connection);
        }
        else {
            return this.connectEmitter(connection)
                .then((connectionItem) => {
                connection.setConnection(connectionItem);
                connection.setStatus(connection_status_constant_1.CONNECTION_STATUS.CONNECTED);
                return connectionItem;
            })
                .catch(err => {
                console.error(err);
                connection.setStatus(connection_status_constant_1.CONNECTION_STATUS.DISCONNECTED);
                throw err;
            });
        }
    }
    /**
     * Connect to service and return connection for further use
     * @param {Connection} connection
     * @returns {Promise<any>} - connection item
     */
    static connectEmitter(connection) {
        throw new model_exception_1.SugoiModelException(exceptions_contant_1.EXCEPTIONS.NOT_IMPLEMENTED.message, exceptions_contant_1.EXCEPTIONS.NOT_IMPLEMENTED.code, "connectEmitter");
    }
    static disconnect(connectionName) {
        this.connections.has(connectionName)
            ? this.connections.get(connectionName).disconnect()
            : null;
    }
}
ConnectableModel.connections = new Map();
ConnectableModel.connectionName = "default";
ConnectableModel.ConnectionType = connection_class_1.Connection;
exports.ConnectableModel = ConnectableModel;
