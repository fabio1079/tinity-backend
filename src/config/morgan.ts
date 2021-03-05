import { Express } from "express";

import morgan from "morgan";

export default (app: Express) => {
  app.use(morgan("dev"));
};
