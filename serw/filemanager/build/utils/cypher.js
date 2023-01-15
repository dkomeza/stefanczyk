"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const crypto_1 = __importDefault(require("crypto"));
const crypto_js_1 = __importDefault(require("crypto-js"));
dotenv_1.default.config();
class cypher {
    constructor() {
        this.cypherPassword = (password) => {
            return crypto_js_1.default.SHA3(password, { outputLength: 512 }).toString();
        };
        this.createKeyPair = (passwordHash) => {
            const publicKey = crypto_1.default.randomBytes(256).toString("hex");
            const privateKey = crypto_js_1.default.AES.encrypt(publicKey, passwordHash).toString();
            return { publicKey, privateKey };
        };
        this.checkKeyPair = (publicKey, privateKey, passwordHash) => {
            const decryptedPrivateKey = crypto_js_1.default.AES.decrypt(privateKey, passwordHash).toString(crypto_js_1.default.enc.Utf8);
            if (publicKey === decryptedPrivateKey) {
                return true;
            }
            else {
                return false;
            }
        };
        this.cypherFileName = (filename) => {
            const fileName = filename.split(".")[0];
            const extension = filename.split(".")[1];
            return `${crypto_js_1.default.AES.encrypt(fileName, this.fileKey).toString()}.${extension}`;
        };
        this.decypherFileName = (filename) => {
            const fileName = filename.split(".")[0];
            const extension = filename.split(".")[1];
            return `${crypto_js_1.default.AES.decrypt(fileName, this.fileKey).toString(crypto_js_1.default.enc.Utf8)}.${extension}`;
        };
        this.fileKey = process.env.CYPHER_FILE_KEY;
    }
}
exports.default = new cypher();
