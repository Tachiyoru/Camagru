const http = require("http");
const fs = require("fs");
const mongoose = require("mongoose");
const router = require("./routes");
require("dotenv").config();
const path = require("path");

const MG_DB_PSWRD = process.env.MG_DB_PSWRD;
const URI = `mongodb+srv://tachiyoru:${MG_DB_PSWRD}@camagrucluster.5s5jmag.mongodb.net/?retryWrites=true&w=majority&appName=CamagruCluster`;

async function connect() {
  try {
    await mongoose.connect(URI);
    console.log("Connected to DB");
  } catch (err) {
    console.error(err);
  }
}

const requestHandler = (req, res) => {
  const url = req.url;

  if (url === "/") {
    fs.readFile(
      path.join(__dirname, "../public/register.html"),
      (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
          return;
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    );
  } else if (url === "/login") {
    fs.readFile(path.join(__dirname, "../public/login.html"), (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } else if (url.match(/\.css$/)) {
    fs.readFile(path.join(__dirname, "../public", url), (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/css" });
      res.end(data);
    });
  } else if (url.match(/\.webp$/)) {
    fs.readFile(path.join(__dirname, "../public", url), (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/css" });
      res.end(data);
    });
  } else if (url.match(/\.js$/)) {
    fs.readFile(path.join(__dirname, "../public", url), (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
        return;
      }
      res.writeHead(200, { "Content-Type": "application/javascript" });
      res.end(data);
    });
  } else if (url.match(/\.jpg$/)) {
    fs.readFile(path.join(__dirname, "../public", url), (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
        return;
      }
      res.writeHead(200, { "Content-Type": "application/javascript" });
      res.end(data);
    });
  } else {
    router(req, res);
  }
};

const server = http.createServer(requestHandler);
const PORT = process.env.PORT || 3000;

connect();

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
