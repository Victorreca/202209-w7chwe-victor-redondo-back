import "../../loadEnvironment.js";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { RegisterData, LoginData, UserTokenPayload } from "./types";
import User from "../../database/models/User/User.js";
import CustomError from "../../CustomError/CustomError.js";
import environment from "../../loadEnvironment.js";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password, picture } = req.body as RegisterData;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      password: hashedPassword,
      picture,
    });

    res
      .status(201)
      .json({ message: `${newUser.username} has been registered` });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "You couldn't register"
    );
    next(customError);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body as LoginData;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      const loginUsernameError = new CustomError(
        "Username not found",
        401,
        "Username not found"
      );
      next(loginUsernameError);
    }

    if (!(await bcrypt.compare(password, user.password))) {
      const loginPasswordError = new CustomError(
        "Incorrect password",
        401,
        "Incorrect password"
      );
      next(loginPasswordError);
    }

    const tokenPayload: UserTokenPayload = {
      username,
      id: user._id.toString(),
    };

    const token = jwt.sign(tokenPayload, environment.jwtSecret, {
      expiresIn: "2d",
    });

    res.status(200).json({ accessToken: token });
  } catch (error: unknown) {
    next(error);
  }
};
