import type { NextFunction, Request, Response } from "express";
import User from "../../database/models/User/User";
import { registerUser } from "./usersControllers";
import mongoose from "mongoose";
import type { RegisterData } from "./types";

beforeEach(() => {
  jest.clearAllMocks();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

describe("Given a register controller", () => {
  const user: RegisterData = {
    username: "Paco",
    password: "1234",
    picture: "pacopicture.png",
  };

  const req: Partial<Request> = {
    body: user,
  };

  describe("When it receives a user with name 'Paco' and password '1234'", () => {
    test("Then it should invoke its method status with 201 and its method json with the user id and the username", async () => {
      const expectedStatus = 201;

      User.create = jest.fn().mockResolvedValueOnce(user);
      const userId = new mongoose.Types.ObjectId();
      // Bcrypt.hash = jest.fn().mockResolvedValueOnce(user.password);
      User.create = jest.fn().mockResolvedValueOnce({ ...user, _id: userId });

      await registerUser(req as Request, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({
        user: {
          id: userId,
          username: user.username,
          picture: user.picture,
        },
      });
    });
  });
  describe("When it receives a user with name 'Paco' that exists", () => {
    test("Then it should next with status 500 and a public message 'You couldn't register'", async () => {
      const error = new Error("You couldn't register");

      User.create = jest.fn().mockRejectedValueOnce(error);

      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
