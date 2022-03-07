const express = require("express");
const app = express();
const router = express.Router();
const port = 3000;

app.get("/", function (req, res) {
  res.send("hello");
});

app.listen(port, () => {
  console.log(`server is listening at ${port}`);
});
