import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import connectDatabase from "../../database/index";
import User from "../../database/models/User/User";
import app from "../../app";
import type { RegisterData } from "../controllers/types";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDatabase(server.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await server.stop();
});

beforeEach(async () => {
  await User.deleteMany();
});

describe("Given a POST /users/register endpoint", () => {
  describe("When it receives a request with username: 'victor' and password: '1234'", () => {
    test("Then it should respond with a 201 and the message 'victor has been registered'", async () => {
      const registerData: RegisterData = {
        username: "victor",
        password: "1234",
        picture: "sdsd",
      };

      const expectedStatus = 201;
      const expectedMessage = {
        message: `${registerData.username} has been registered`,
      };

      const response = await request(app)
        .post("/users/register")
        .send(registerData)
        .expect(expectedStatus);

      expect(response.body).toStrictEqual(expectedMessage);
    });
  });

  describe("When it receives a request with username: 'paco', password: '1234' which already exists", () => {
    test("Then it should respond witch code status 500 and the error 'You couldn't register", async () => {
      await User.create({
        username: "paco",
        password: "1234",
      });
      const requestBody: RegisterData = {
        username: "paco",
        password: "1234",
      };
      const expectedStatus = 500;
      const expectedMessage = { error: "You couldn't register" };

      const response = await request(app)
        .post("/users/register")
        .send(requestBody)
        .expect(expectedStatus);

      expect(response.body).toStrictEqual(expectedMessage);
    });
  });
});
