import { Express } from "express";

import LinkController from "./controllers/LinkController";
import HealthController from "./controllers/HealthController";

export default (app: Express) => {
  app.get("/health", HealthController.index);

  app.get("/top", LinkController.top);
  app.post("/short-url", LinkController.shortUrl);
};
