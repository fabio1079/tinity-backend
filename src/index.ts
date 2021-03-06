import "reflect-metadata";

import connection from "./config/connection";

import app from "./config/app";
import settupApp from "./config/settup-app";

const PORT = process.env.PORT || 3001;

connection
  .create()
  .then(async (connection) => {
    let testCon = await connection.query("select 1");
    settupApp(app);

    app.listen(PORT, () => {
      console.log(testCon);
      console.log(`Node server started on port: ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
