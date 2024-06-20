// src/router.js
const url = require("url");
const UserController = require("./controllers/UserController");

const router = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method.toLowerCase();
  const parseFormData = (body) => {
    return body.split("&").reduce((acc, pair) => {
      const [key, value] = pair.split("=");
      acc[decodeURIComponent(key)] = decodeURIComponent(value);
      console.log("acc", acc);
      return acc;
    }, {});
  };
  //   console.log(path, method);
  if (path === "/users" && method === "get") {
    console.log("user list called");
    await UserController.index(req, res);
  } else if (path.match(/^\/users\/\w+$/) && method === "get") {
    req.params = { id: path.split("/")[2] };
    await UserController.show(req, res);
  } else if (path === "/users" && method === "post") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      req.body = parseFormData(body);
      console.log("req.body", req.body);
      await UserController.create(req, res);
    });
  } else if (path.match(/^\/users\/\w+$/) && method === "patch") {
    req.params = { id: path.split("/")[2] };
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      req.body = JSON.parse(body);
      await UserController.update(req, res);
    });
  } else if (path.match(/^\/users\/\w+$/) && method === "delete") {
    req.params = { id: path.split("/")[2] };
    await UserController.destroy(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
};

module.exports = router;
