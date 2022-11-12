import "./loadEnvironment.js";
import startServer from "./server/index.js";

const port = process.env.PORT;

await startServer(+port);
