import "./loadEnvironment.js";
import startServer from "./server/index.js";
import connectDatabase from "./database/index.js";

const port = process.env.PORT;
const url = process.env.MONGODB_URL;

await startServer(+port);
await connectDatabase(url);
