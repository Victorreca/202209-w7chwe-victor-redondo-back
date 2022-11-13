import type { Response } from "express";
import { notFoundError } from "./errors";

describe("Given notFoundError middleware", () => {
  describe("When it receives a request", () => {
    const expectedMessage = {
      message: "Endpoint not found",
    };
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnValue(expectedMessage),
    };
    const expectedStatus = 404;
    test("Then it should call its code status with 404", () => {
      notFoundError(null, res as Response);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });
});
