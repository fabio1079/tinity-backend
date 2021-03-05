import "reflect-metadata";
import { createConnection } from "typeorm";

import app from "./config/app";
import morgan from "./config/morgan";
import routes from "./routes";

morgan(app);
routes(app);

const PORT = process.env.PORT || 3001;

createConnection()
  .then(async (connection) => {
    let testCon = await connection.query("select 1");

    app.listen(PORT, () => {
      console.log(testCon);
      console.log(`Node server started on port: ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
