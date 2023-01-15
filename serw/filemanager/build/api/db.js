"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nedb_1 = __importDefault(require("nedb"));
class Database {
    constructor() {
        this.UserDatabase = new nedb_1.default({ filename: "../../db/users.db" });
    }
    createDatabase() {
        this.UserDatabase.loadDatabase();
    }
    getUser(username) {
        this.UserDatabase.loadDatabase();
        // return new Promise((resolve, reject) => {
        //   this.Database;
        // });
    }
    createUser(data) {
        console.log(data);
    }
}
exports.default = new Database();
