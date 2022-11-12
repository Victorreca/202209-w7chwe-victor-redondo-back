import "../loadEnvironment.js";
import debugCreator from "debug";
import app from "../app.js";
import chalk from "chalk";

const debug = debugCreator("lenkiden:root");

const startServer = async (port: number) => {
  await new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(chalk.green(`Server is listening on port ${port}`));
      resolve(server);
    });

    server.on("error", (error: Error) => {
      debug(chalk.red(`There was an error in server ${error.message}`));
      reject(error);
    });
  });
};

export default startServer;
