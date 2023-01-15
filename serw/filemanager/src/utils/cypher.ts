import dotenv from "dotenv";
import crypto from "crypto";
import CryptoJS from "crypto-js";

dotenv.config();

class cypher {
  private fileKey: string;
  constructor() {
    this.fileKey = process.env.CYPHER_FILE_KEY!;
  }
  cypherPassword = (password: string) => {
    return CryptoJS.SHA3(password, { outputLength: 512 }).toString();
  };
  createKeyPair = (passwordHash: string) => {
    const publicKey = crypto.randomBytes(256).toString("hex");
    const privateKey = CryptoJS.AES.encrypt(publicKey, passwordHash).toString();
    return { publicKey, privateKey };
  };
  checkKeyPair = (
    publicKey: string,
    privateKey: string,
    passwordHash: string
  ) => {
    const decryptedPrivateKey = CryptoJS.AES.decrypt(
      privateKey,
      passwordHash
    ).toString(CryptoJS.enc.Utf8);
    if (publicKey === decryptedPrivateKey) {
      return true;
    } else {
      return false;
    }
  };
  cypherFileName = (filename: string) => {
    const fileName = filename.split(".")[0];
    const extension = filename.split(".")[1];
    return `${CryptoJS.AES.encrypt(
      fileName,
      this.fileKey
    ).toString()}.${extension}`;
  };
  decypherFileName = (filename: string) => {
    const fileName = filename.split(".")[0];
    const extension = filename.split(".")[1];
    return `${CryptoJS.AES.decrypt(fileName, this.fileKey).toString(
      CryptoJS.enc.Utf8
    )}.${extension}`;
  };
}

export default new cypher();
