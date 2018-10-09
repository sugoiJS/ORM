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
const object_utils_1 = require("../utils/object.utils");
const connection_status_constant_1 = require("../constants/connection-status.constant");
class ConnectableModel extends model_abstract_1.ModelAbstract {
    static setConnection(configData, connectionClass, connectionName = "default") {
        if (!connectionClass)
            throw new model_exception_1.SugoiModelException(exceptions_contant_1.EXCEPTIONS.CONNECTABLE_CONNECTION_NOT_CONFIGURED.message, exceptions_contant_1.EXCEPTIONS.CONNECTABLE_CONNECTION_NOT_CONFIGURED.code, this.name);
        configData['connectionName'] = connectionName;
        const connection = object_utils_1.clone(connectionClass, configData);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGFibGUtbW9kZWwuYWJzdHJhY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9tb2RlbHMvY29ubmVjdGFibGUtbW9kZWwuYWJzdHJhY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFEQUErQztBQUUvQyxtRUFBa0U7QUFDbEUsd0VBQTJEO0FBRTNELHdEQUE0QztBQUM1Qyx3RkFBMEU7QUFHMUUsTUFBc0IsZ0JBQWlCLFNBQVEsOEJBQWE7SUFNakQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUE2QixFQUFFLGVBQTJDLEVBQUUsaUJBQXNCLFNBQVM7UUFDbkksSUFBSSxDQUFDLGVBQWU7WUFDaEIsTUFBTSxJQUFJLHFDQUFtQixDQUFDLCtCQUFVLENBQUMscUNBQXFDLENBQUMsT0FBTyxFQUFFLCtCQUFVLENBQUMscUNBQXFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5SixVQUFVLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxjQUFjLENBQUM7UUFDOUMsTUFBTSxVQUFVLEdBQUcsb0JBQUssQ0FBQyxlQUFlLEVBQUUsVUFBVSxDQUFnQixDQUFDO1FBQ3JFLFVBQVUsQ0FBQyxNQUFNLEdBQUcsOENBQWlCLENBQUMsWUFBWSxDQUFDO1FBQ25ELElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNqRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7SUFFeEMsQ0FBQztJQUVNLE1BQU0sQ0FBQyxhQUFhLENBQUMsaUJBQXlCLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtRQUN6RSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQztZQUN2QyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDO1lBQ3RDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDZixDQUFDO0lBRU0sTUFBTSxDQUFDLGlCQUFpQixDQUFDLGlCQUF5QixTQUFTO1FBQzlELElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDO0lBQ3pDLENBQUM7SUFFTSxNQUFNLENBQUMsaUJBQWlCO1FBQzNCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUMvQixDQUFDO0lBRU0sTUFBTSxDQUFPLE9BQU8sQ0FBQyxpQkFBeUIsSUFBSSxDQUFDLGlCQUFpQixFQUFFOztZQUN6RSxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUN4RCxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNiLE1BQU0sSUFBSSxxQ0FBbUIsQ0FBQywrQkFBVSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sRUFBRSwrQkFBVSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2xIO1lBRUQsSUFBSSxNQUFNLFVBQVUsQ0FBQyxXQUFXLEVBQUUsRUFBRTtnQkFDaEMsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQ3RDO2lCQUFNO2dCQUNILE9BQU8sVUFBVSxDQUFDLE9BQU8sRUFBRTtxQkFDdEIsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQztxQkFDdEIsS0FBSyxDQUFDLENBQU0sR0FBRyxFQUFDLEVBQUU7b0JBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDbkIsSUFBSTt3QkFDQSxNQUFNLFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztxQkFDakM7b0JBQUMsT0FBTyxHQUFHLEVBQUU7cUJBQ2I7b0JBQ0QsTUFBTSxHQUFHLENBQUM7Z0JBQ2QsQ0FBQyxDQUFBLENBQUMsQ0FBQzthQUVWO1FBQ0wsQ0FBQztLQUFBO0lBRU0sTUFBTSxDQUFDLFVBQVUsQ0FBQyxjQUF1QjtRQUM1QyxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3RELE9BQU8sQ0FBQyxDQUFDLFVBQVU7WUFDZixDQUFDLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRTtZQUN6QixDQUFDLENBQUMsSUFBSSxDQUFBO0lBQ2QsQ0FBQzs7QUExRGdCLDRCQUFXLEdBQTZCLElBQUksR0FBRyxFQUFFLENBQUM7QUFDbEQsK0JBQWMsR0FBVyxTQUFTLENBQUM7QUFGeEQsNENBNERDIn0=