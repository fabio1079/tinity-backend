const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  return res.json({ message: "Hello World" });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Node server started on port: ${PORT}`);
});
