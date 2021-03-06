import fs, { PathLike } from "fs";

import { ConnectionOptions } from "typeorm";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const getConfigFileName = (): PathLike => {
  const { NODE_ENV } = process.env;

  switch (NODE_ENV) {
    case "development":
      return "ormconfig.json";
    case "test":
      return "ormconfig.test.json";
    case "production":
      throw new Error("NOT IMPLEMENTED YET: production");
    default:
      throw new Error(`INVALID ENV OPTION: ${NODE_ENV}`);
  }
};

const ormconfig = (): Promise<ConnectionOptions> => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      getConfigFileName(),
      "utf-8",
      (err: NodeJS.ErrnoException, data: string) => {
        if (err) {
          return reject(err);
        } else {
          const config = <ConnectionOptions>JSON.parse(data);
          return resolve(config);
        }
      }
    );
  });
};

export default ormconfig;
