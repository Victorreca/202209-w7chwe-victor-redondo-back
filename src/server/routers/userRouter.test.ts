import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import connectDatabase from "../../database/index";
import app from "../../app";
import User from "../../database/models/User/User";
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
    test("Then it should respond with a 201 status and a new user 'victor'", async () => {
      const expectedStatus = 201;
      const expectedMessage = { message: "Tutto benne" };

      const registerData: RegisterData = {
        username: "victor",
        password: "1234",
        picture: "sdsd",
      };

      const response = await request(app)
        .post("/users/register")
        .send(registerData)
        .expect(expectedStatus);

      expect(response.body).toStrictEqual(expectedMessage);
    });
  });
});
