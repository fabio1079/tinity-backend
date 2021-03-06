import { Express } from "express";

import morgan from "./morgan";
import routes from "../routes";

export default (app: Express): Express => {
  morgan(app);
  routes(app);

  return app;
};
