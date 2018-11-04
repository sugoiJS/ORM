"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
class DummyConnection {
    connect() {
        if (this.getConnectionString().trim() === ":") {
            return Promise.resolve(false);
        }
        this.connectionClient = {
            disconnect: () => Promise.resolve(true)
        };
        this.status = index_1.CONNECTION_STATUS.CONNECTED;
        return Promise.resolve(true);
    }
    disconnect() {
        console.log("disconnect");
        return this.connectionClient.disconnect()
            .then(() => {
            this.status = index_1.CONNECTION_STATUS.DISCONNECTED;
            return true;
        });
    }
    isConnected() {
        return Promise.resolve(this.status === index_1.CONNECTION_STATUS.CONNECTED);
    }
    getConnectionString() {
        let connectionString = "";
        if (this.user && this.password)
            connectionString += `${this.user}:${this.password}@`;
        connectionString += `${this.hostName || ""}:${this.port || ""}`;
        if (this.authDB)
            connectionString += `/${this.authDB}`;
        return connectionString;
    }
}
exports.DummyConnection = DummyConnection;
