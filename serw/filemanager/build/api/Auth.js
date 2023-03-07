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
const DB_1 = __importDefault(require("./DB"));
const cypher_1 = __importDefault(require("../utils/cypher"));
class Auth {
    constructor() {
        this.db = DB_1.default;
    }
    login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const publicKey = yield this.db.updateKeyPair(username, cypher_1.default.cypherPassword(password));
                return { username, publicKey };
            }
            catch (err) {
                return { error: err };
            }
        });
    }
    signup(username, password, passwordRepeat) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordHash = cypher_1.default.cypherPassword(password);
            const { publicKey, privateKey } = cypher_1.default.createKeyPair(passwordHash);
            if (password !== passwordRepeat) {
                return { error: "Passwords do not match" };
            }
            try {
                yield this.db.createUser({
                    username,
                    passwordHash,
                    privateKey,
                    theme: 1,
                    fontSize: 8,
                });
                return { username, publicKey };
            }
            catch (err) {
                return { error: err };
            }
        });
    }
    auth(username, publicKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db.getUser(username, publicKey);
                return true;
            }
            catch (err) {
                return false;
            }
        });
    }
}
exports.default = new Auth();
