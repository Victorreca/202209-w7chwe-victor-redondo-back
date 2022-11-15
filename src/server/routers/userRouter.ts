import express from "express";
import { loginUser, registerUser } from "../controllers/usersControllers.js";

// eslint-disable-next-line new-cap
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

export default userRouter;
