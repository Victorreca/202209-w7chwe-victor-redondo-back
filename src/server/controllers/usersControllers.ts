import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import type { RegisterData } from "./types";
import User from "../../database/models/User/User.js";
import CustomError from "../../CustomError/CustomError.js";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password, picture } = req.body as RegisterData;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      password: hashedPassword,
      picture,
    });

    res.status(201).json({ message: "Tutto benne" });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "You couldn't register"
    );
    next(customError);
  }
};
