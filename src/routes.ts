import { Express } from "express";

import LinkController from "./controllers/LinkController";

export default (app: Express) => {

  app.get("/", (req, res) => {
    return res.json({ message: "Hello World" });
  });

  app.get("/top", LinkController.top);
  app.post("/short-url", LinkController.shortUrl);
};
