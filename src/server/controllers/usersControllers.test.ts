import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import environment from "../../loadEnvironment";
import User from "../../database/models/User/User";
import { registerUser, loginUser } from "./usersControllers";
import { loginError } from "../../CustomError/errors";
import mongoose from "mongoose";
import type { RegisterData } from "./types";

beforeEach(() => {
  jest.clearAllMocks();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const tokenPayload = {};

const token = jwt.sign(tokenPayload, environment.jwtSecret);

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
    test("Then it should invoke its method status with 201 and the message 'Paco has been registered'", async () => {
      const expectedStatus = 201;
      const expectedMessage = {
        message: `${user.username} has been registered`,
      };

      User.create = jest.fn().mockResolvedValueOnce(user);
      const userId = new mongoose.Types.ObjectId();
      User.create = jest.fn().mockResolvedValueOnce({ ...user, _id: userId });

      await registerUser(req as Request, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedMessage);
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

describe("Given a login controllers", () => {
  describe("When it receives a request with username 'Paco' and password '1234'", () => {
    test("Then it should call its method with a 200 status code", async () => {
      const expectedStatus = 200;
      const userId = new mongoose.Types.ObjectId();

      const user: RegisterData = {
        username: "Paco",
        password: "1234",
      };
      const req: Partial<Request> = {
        body: {
          username: "Paco",
          password: "1234",
        },
      };

      User.findOne = jest.fn().mockResolvedValue({ ...user, _id: userId });
      jwt.sign = jest.fn().mockReturnValueOnce(token);
      bcrypt.compare = jest.fn().mockResolvedValue(true);

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives a request with the username 'jaimito' and is not registered", () => {
    test("Then it should call next with a CustomError with public message 'Username not found'", async () => {
      const user: RegisterData = {
        username: "jaimito",
        password: "james",
      };

      const req: Partial<Request> = {};

      req.body = user;

      User.findOne = jest.fn().mockResolvedValue(null);

      await loginUser(req as Request, null, next as NextFunction);

      expect(next).toHaveBeenCalledWith(loginError.userNotFound);
    });
  });

  describe("When it receives a request with the username 'jaimito' and the incorrect password 'james'", () => {
    test("Then it should call next with a CustomError with public message 'Incorrect password'", async () => {
      const user: RegisterData = {
        username: "jaimito",
        password: "james",
      };
      const userId = new mongoose.Types.ObjectId();
      const req: Partial<Request> = {};
      req.body = user;
      User.findOne = jest.fn().mockResolvedValue({ ...user, _id: userId });
      bcrypt.compare = jest
        .fn()
        .mockRejectedValue(loginError.passwordIncorrect);

      await loginUser(req as Request, null, next as NextFunction);

      expect(next).toHaveBeenCalledWith(loginError.passwordIncorrect);
    });
  });
});
