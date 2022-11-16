import CustomError from "./CustomError.js";

export const loginError = {
  userNotFound: new CustomError(
    "Username not found",
    401,
    "Username not found"
  ),
  passwordIncorrect: new CustomError(
    "Incorrect password",
    401,
    "Incorrect password"
  ),
};
