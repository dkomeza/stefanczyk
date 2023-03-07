import Datastore from "nedb";
import cypher from "../utils/cypher";

interface User {
  username: string;
  passwordHash: string;
  privateKey: string;
  theme: number;
  fontSize: number;
}

class Database {
  private UserDatabase: Datastore;
  constructor() {
    this.UserDatabase = new Datastore({
      filename: "db/users.db",
      autoload: true,
    });
  }
  async createUser(data: User) {
    return new Promise((resolve, reject) => {
      this.UserDatabase.findOne({ username: data.username }, (err, doc) => {
        if (doc) {
          reject("User already exists");
        }
      });
      this.UserDatabase.insert(
        {
          username: data.username,
          passwordHash: data.passwordHash,
          privateKey: data.privateKey,
          theme: 1,
          fontSize: 8,
        },
        (err, doc) => {
          if (err) {
            reject(err);
          } else {
            resolve(doc);
          }
        }
      );
    });
  }
  async updateKeyPair(username: string, passwordHash: string) {
    const { privateKey, publicKey } = cypher.createKeyPair(passwordHash);
    return new Promise((resolve, reject) => {
      this.UserDatabase.findOne(
        {
          username: username,
          passwordHash: passwordHash,
        },
        (err, doc) => {
          if (doc) {
            this.UserDatabase.update(
              { username: username, passwordHash: passwordHash },
              { $set: { privateKey: privateKey } },
              {},
              (err, numReplaced) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(publicKey);
                }
              }
            );
          } else {
            reject("User not found");
          }
        }
      );
    });
  }
  async getUser(username: string, publicKey: string) {
    return new Promise((resolve, reject) => {
      this.UserDatabase.findOne({ username: username }, (err, doc: User) => {
        if (doc) {
          if (
            cypher.checkKeyPair(publicKey, doc.privateKey, doc.passwordHash)
          ) {
            resolve(doc.username);
          } else {
            reject("Invalid key pair");
          }
        } else {
          reject("User not found");
        }
      });
    });
  }
  async getTheme(username: string) {
    return new Promise((resolve, reject) => {
      this.UserDatabase.findOne({ username: username }, (err, doc: User) => {
        if (doc) {
          resolve({ theme: doc.theme, fontSize: doc.fontSize });
        } else {
          reject("User not found");
        }
      });
    });
  }

  async setTheme(username: string, theme: number, fontSize: number) {
    return new Promise((resolve, reject) => {
      this.UserDatabase.findOne({ username: username }, (err, doc: User) => {
        if (doc) {
          this.UserDatabase.update(
            { username: username },
            { $set: { theme: theme, fontSize: fontSize } },
            {},
            (err, numReplaced) => {
              if (err) {
                reject(err);
              }
              resolve({ theme: theme, fontSize: fontSize });
            }
          );
        } else {
          reject("User not found");
        }
      });
    });
  }
}

export default new Database();
