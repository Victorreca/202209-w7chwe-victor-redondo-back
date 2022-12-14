import express from "express";
import morgan from "morgan";
import cors from "cors";
import { generalError, notFoundError } from "./server/middleware/errors.js";
import userRouter from "./server/routers/userRouter.js";

const app = express();

app.use(cors());

app.disable("x-powered-by");

app.use(morgan("dev"));
app.use(express.json());

app.use("/users", userRouter);

app.use(generalError);
app.use(notFoundError);

export default app;
