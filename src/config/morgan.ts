import { Express } from "express";

import morgan from "morgan";

export default (app: Express) => {
  const ENV = process.env.NODE_ENV;

  switch (ENV) {
    case "development":
      app.use(morgan("dev"));
      break;
    case "test":
      break;
    case "production":
      app.use(morgan("common"));
      break;
    default:
      throw new Error(`Invalid environment: ${ENV}`);
  }
};
