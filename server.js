const express = require("express");
const uuid = require("uuid");

const app = express();
const router = express.Router();
const path = require("path");
const PORT = process.env.PORT || 3001;
const fs = require("fs");
const { json } = require("express/lib/response");
const { randomUUID } = require("crypto");

// Function to write any data to a JSON file by first stringifying it
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData saved to ${destination}`)
  );

// Function to read a file and append new data to it
const readAndAppend = (content, file) => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

// Function to read a file and delete specified data from it
const readAndDelete = (id, file) => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      writeToFile(
        file,
        parsedData.filter((item) => item.id != id)
      );
    }
  });
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Get request handler to render the notes.html file when the user accesses the notes page
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// Post request handler for when the user adds a new note
app.post("/api/notes", function (req, res) {
  req.body["id"] = randomUUID();

  readAndAppend(req.body, "db/db.json");
});

// Get request handler to render the existing notes in the database when the user loads the notes page
app.get("/api/notes", function (req, res) {
  fs.readFile("db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      res.send(data);
    }
  });
});

// Wildcard request handler, so that if the user types in any query strings that aren't handled, they will be returned to the index
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Delete request handler, will delete a chose note
app.delete("/api/notes/:id", function (req, res) {
  readAndDelete(req.params.id, "db/db.json");
  console.log(req.params.id);
});

app.listen(PORT, () => {
  console.log(`server is listening at ${PORT}`);
});
