"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDBConnection = exports.connectToDB = void 0;
const promise_1 = require("mysql2/promise");
let connection;
const connectToDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        connection = yield (0, promise_1.createConnection)({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            charset: "utf8",
        });
        console.log("Connected to the database");
    }
    catch (error) {
        console.error("Failed to connect to the database:", error);
    }
});
exports.connectToDB = connectToDB;
const getDBConnection = () => {
    if (!connection) {
        throw new Error("Database connection has not been established");
    }
    return connection;
};
exports.getDBConnection = getDBConnection;
