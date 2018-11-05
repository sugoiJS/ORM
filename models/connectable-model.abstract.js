"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const model_abstract_1 = require("./model.abstract");
const model_exception_1 = require("../exceptions/model.exception");
const exceptions_contant_1 = require("../constants/exceptions.contant");
const connection_status_constant_1 = require("../constants/connection-status.constant");
const index_1 = require("../index");
class ConnectableModel extends model_abstract_1.ModelAbstract {
    static setConnection(configData, connectionClass, connectionName = "default") {
        if (!connectionClass)
            throw new model_exception_1.SugoiModelException(exceptions_contant_1.EXCEPTIONS.CONNECTABLE_CONNECTION_NOT_CONFIGURED.message, exceptions_contant_1.EXCEPTIONS.CONNECTABLE_CONNECTION_NOT_CONFIGURED.code, this.name);
        configData['connectionName'] = connectionName;
        const connection = index_1.clone(connectionClass, configData);
        connection.status = connection_status_constant_1.CONNECTION_STATUS.DISCONNECTED;
        this.connections.set(connectionName, connection);
        return this.connect(connectionName);
    }
    static getConnection(connectionName = this.getConnectionName()) {
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
        return __awaiter(this, void 0, void 0, function* () {
            const connection = this.connections.get(connectionName);
            if (!connection) {
                throw new model_exception_1.SugoiModelException(exceptions_contant_1.EXCEPTIONS.CONFIGURATION_MISSING.message, exceptions_contant_1.EXCEPTIONS.CONFIGURATION_MISSING.code);
            }
            if (yield connection.isConnected()) {
                return Promise.resolve(connection);
            }
            else {
                return connection.connect()
                    .then(() => connection)
                    .catch((err) => __awaiter(this, void 0, void 0, function* () {
                    console.error(err);
                    try {
                        yield connection.disconnect();
                    }
                    catch (err) {
                    }
                    throw err;
                }));
            }
        });
    }
    static disconnect(connectionName) {
        const connection = this.getConnection(connectionName);
        return !!connection
            ? connection.disconnect()
            : null;
    }
}
ConnectableModel.connections = new Map();
ConnectableModel.connectionName = "default";
exports.ConnectableModel = ConnectableModel;
