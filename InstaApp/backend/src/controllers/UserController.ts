import { UserModel } from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface UserData {
  username: string;
  email: string;
  password: string;
  name: string;
  surname: string;
}

interface LoginData {
  login: string;
  password: string;
}

class UserController {
  async registerUser(userData: UserData) {
    const { username, email, password, name, surname } = userData;
    if (await this.checkTakenUsername(username)) {
      return { ok: false, status: "Username is taken" };
    }
    if (await this.checkTakenEmail(email)) {
      return { ok: false, status: "Email is taken" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const processedUserData = {
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      surname,
    };

    const user = await UserModel.create(processedUserData);

    const token = jwt.sign({ id: user._id }, process.env["TOKEN_KEY"]!, {
      expiresIn: "2h",
    });

    return { ok: true, token };
  }

  private async checkTakenUsername(username: string): Promise<boolean> {
    const takenUsername = await UserModel.findOne({ username });
    if (takenUsername) {
      return true;
    }
    return false;
  }
  private async checkTakenEmail(email: string): Promise<boolean> {
    const takenEmail = await UserModel.findOne({ email });
    if (takenEmail) {
      return true;
    }
    return false;
  }

  async loginUser(loginData: LoginData) {
    const { login, password } = loginData;

    const user = await UserModel.findOne({
      $or: [{ username: login }, { email: login }],
    });

    if (!user) {
      return { ok: false, status: "User not found" };
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return { ok: false, status: "Incorrect password" };
    }

    const token = jwt.sign({ id: user._id }, process.env["TOKEN_KEY"]!, {
      expiresIn: "2h",
    });

    return { ok: true, token };
  }

  async authenticateUser(token: string): Promise<boolean> {
    try {
      jwt.verify(token, process.env["TOKEN_KEY"]!);
      return true;
    } catch (err) {
      return false;
    }
  }

  async getUserData(token: string) {
    const decodedToken = jwt.decode(token);
    console.log(decodedToken);
    // const user = await UserModel.findById(decodedToken?.id);
    // if (!user) {
    //   return { ok: false, status: "User not found" };
    // }
    // return { ok: true, user };
  }

  async getAllUsers() {
    const users = await UserModel.find({});
    return users;
  }
}

export default new UserController();
