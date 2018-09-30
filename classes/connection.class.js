"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_status_constant_1 = require("../constants/connection-status.constant");
const core_1 = require("@sugoi/core");
const model_exception_1 = require("../exceptions/model.exception");
const index_1 = require("../index");
let Connection = class Connection {
    constructor(hostName, db, port) {
        this.hostName = hostName;
        this.db = db;
        this.port = port;
        this.status = connection_status_constant_1.CONNECTION_STATUS.DISCONNECTED;
        this.connectionName = this.db;
    }
    static builder(hostName, db, port) {
        return new this(hostName, db, port);
    }
    static clone(config) {
        return Object.assign(this.builder(null, null), config);
    }
    setCredentials(user, password) {
        this.user = user;
        this.password = password;
        return this;
    }
    setStatus(status) {
        this.status = status;
        return this;
    }
    setAuthDB(db) {
        this.authDB = db;
        return this;
    }
    setConnectionName(name = this.db) {
        this.connectionName = name;
    }
    isConnected() {
        return this.status === connection_status_constant_1.CONNECTION_STATUS.CONNECTED;
    }
    getConnectionString() {
        throw new model_exception_1.SugoiModelException(index_1.EXCEPTIONS.NOT_IMPLEMENTED.message, index_1.EXCEPTIONS.NOT_IMPLEMENTED.code, ["getConnectionString", "please override the function by your connection implementation"]);
    }
    disconnect() {
        this.setStatus(connection_status_constant_1.CONNECTION_STATUS.DISCONNECTED);
        return Promise.resolve(null);
    }
    setConnection(connection) {
        this.connection = connection;
    }
    getConnection() {
        return this.connection;
    }
};
Connection = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [String, String, Number])
], Connection);
exports.Connection = Connection;
