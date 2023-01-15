import db from "./DB";
import cypher from "../utils/cypher";

class Auth {
  private db: typeof db;
  constructor() {
    this.db = db;
  }

  public async login(username: string, password: string) {
    try {
      const publicKey = await this.db.updateKeyPair(
        username,
        cypher.cypherPassword(password)
      );
      return { username, publicKey };
    } catch (err) {
      return { error: err };
    }
  }

  public async signup(username: string, password: string) {
    const passwordHash = cypher.cypherPassword(password);
    const { publicKey, privateKey } = cypher.createKeyPair(passwordHash);
    try {
      await this.db.createUser({ username, passwordHash, privateKey });
      return { username, publicKey };
    } catch (err) {
      return { error: err };
    }
  }

  public async auth(username: string, publicKey: string) {
    try {
      await this.db.getUser(username, publicKey);
      return true;
    } catch (err) {
      return false;
    }
  }
}

export default new Auth();
