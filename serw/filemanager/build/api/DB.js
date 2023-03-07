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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nedb_1 = __importDefault(require("nedb"));
const cypher_1 = __importDefault(require("../utils/cypher"));
class Database {
    constructor() {
        this.UserDatabase = new nedb_1.default({
            filename: "db/users.db",
            autoload: true,
        });
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.UserDatabase.findOne({ username: data.username }, (err, doc) => {
                    if (doc) {
                        reject("User already exists");
                    }
                });
                this.UserDatabase.insert({
                    username: data.username,
                    passwordHash: data.passwordHash,
                    privateKey: data.privateKey,
                    theme: 1,
                    fontSize: 8,
                }, (err, doc) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(doc);
                    }
                });
            });
        });
    }
    updateKeyPair(username, passwordHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const { privateKey, publicKey } = cypher_1.default.createKeyPair(passwordHash);
            return new Promise((resolve, reject) => {
                this.UserDatabase.findOne({
                    username: username,
                    passwordHash: passwordHash,
                }, (err, doc) => {
                    if (doc) {
                        this.UserDatabase.update({ username: username, passwordHash: passwordHash }, { $set: { privateKey: privateKey } }, {}, (err, numReplaced) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(publicKey);
                            }
                        });
                    }
                    else {
                        reject("User not found");
                    }
                });
            });
        });
    }
    getUser(username, publicKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.UserDatabase.findOne({ username: username }, (err, doc) => {
                    if (doc) {
                        if (cypher_1.default.checkKeyPair(publicKey, doc.privateKey, doc.passwordHash)) {
                            resolve(doc.username);
                        }
                        else {
                            reject("Invalid key pair");
                        }
                    }
                    else {
                        reject("User not found");
                    }
                });
            });
        });
    }
    getTheme(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.UserDatabase.findOne({ username: username }, (err, doc) => {
                    if (doc) {
                        resolve({ theme: doc.theme, fontSize: doc.fontSize });
                    }
                    else {
                        reject("User not found");
                    }
                });
            });
        });
    }
    setTheme(username, theme, fontSize) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.UserDatabase.findOne({ username: username }, (err, doc) => {
                    if (doc) {
                        this.UserDatabase.update({ username: username }, { $set: { theme: theme, fontSize: fontSize } }, {}, (err, numReplaced) => {
                            if (err) {
                                reject(err);
                            }
                            resolve({ theme: theme, fontSize: fontSize });
                        });
                    }
                    else {
                        reject("User not found");
                    }
                });
            });
        });
    }
}
exports.default = new Database();
