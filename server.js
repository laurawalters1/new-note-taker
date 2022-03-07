const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/Develop/public/index.html"));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/Develop/public/notes.html"));
});

app.listen(PORT, () => {
  console.log(`server is listening at ${PORT}`);
});
