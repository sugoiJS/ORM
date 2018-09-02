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
var connection_status_constant_1 = require("../constants/connection-status.constant");
var core_1 = require("@sugoi/core");
var model_exception_1 = require("../exceptions/model.exception");
var index_1 = require("../index");
var Connection = /** @class */ (function () {
    function Connection(hostName, db, port) {
        this.hostName = hostName;
        this.db = db;
        this.port = port;
        this.status = connection_status_constant_1.CONNECTION_STATUS.DISCONNECTED;
        this.connectionName = this.db;
    }
    Connection.builder = function (hostName, db, port) {
        return new this(hostName, db, port);
    };
    Connection.clone = function (config) {
        return Object.assign(this.builder(null, null), config);
    };
    Connection.prototype.setCredentials = function (user, password) {
        this.user = user;
        this.password = password;
        return this;
    };
    Connection.prototype.setStatus = function (status) {
        this.status = status;
        return this;
    };
    Connection.prototype.setAuthDB = function (db) {
        this.authDB = db;
        return this;
    };
    Connection.prototype.setConnectionName = function (name) {
        if (name === void 0) { name = this.db; }
        this.connectionName = name;
    };
    Connection.prototype.isConnected = function () {
        return this.status === connection_status_constant_1.CONNECTION_STATUS.CONNECTED;
    };
    Connection.prototype.getConnectionString = function () {
        throw new model_exception_1.SugoiModelException(index_1.EXCEPTIONS.NOT_IMPLEMENTED.message, index_1.EXCEPTIONS.NOT_IMPLEMENTED.code, ["getConnectionString", "please override the function by your connection implementation"]);
    };
    Connection.prototype.disconnect = function () {
        this.setStatus(connection_status_constant_1.CONNECTION_STATUS.DISCONNECTED);
        return Promise.resolve(null);
    };
    Connection.prototype.setConnection = function (connection) {
        this.connection = connection;
    };
    Connection.prototype.getConnection = function () {
        return this.connection;
    };
    Connection = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [String, String, Number])
    ], Connection);
    return Connection;
}());
exports.Connection = Connection;
