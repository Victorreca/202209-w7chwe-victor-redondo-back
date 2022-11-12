import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import CustomError from "../../CustomError/CustomError.js";
import type { Credentials } from "./types";
import User from "../../database/models/User/User.js";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, password, picture } = req.body as Credentials;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      password: hashedPassword,
      picture,
    });

    res.status(201).json({ newUser });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "You couldn't register"
    );
    next(customError);
  }
};
