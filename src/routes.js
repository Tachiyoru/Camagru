const url = require("url");
const fs = require("fs");
const path2 = require("path");
const UserController = require("./controllers/UserController");
const PictureController = require("./controllers/PictureController");
const jwt = require("jsonwebtoken");
const { json } = require("stream/consumers");

const router = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method.toLowerCase();

  function parseCookies(req) {
    let list = {};
    const cookiesHeader = req.headers.cookie;

    if (cookiesHeader) {
      cookiesHeader.split(";").forEach((cookie) => {
        let [name, ...rest] = cookie.split("=");
        name = name.trim();
        if (!name) return;
        const value = rest.join("=").trim();
        if (!value) return;
        list[name] = decodeURIComponent(value);
      });
    }
    return list;
  }

  function generateToken(user) {
    return jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "1h" });
  }

  function verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return null;
    }
  }

  const parseFormData = (body) => {
    return body.split("&").reduce((acc, pair) => {
      const [key, value] = pair.split("=");
      acc[decodeURIComponent(key)] = decodeURIComponent(value);
      return acc;
    }, {});
  };

  if (path === "/users" && method === "get") {
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
      try {
        const user = await UserController.create(req, res);
        if (res.statusCode === 400) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ message: "Username or Email already exists" })
          );
          return;
        }
        const token = generateToken(user);
        res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Path=/`);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User registered successfully" }));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ message: "Username or Email already exists" })
        );
      }
    });
  } else if (path === "/update" && method === "patch") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      const cookies = parseCookies(req);
      const token = cookies.token;
      req.body = parseFormData(body);
      if (token) {
        const user = verifyToken(token);
        if (user && user.user.confirmed === true) {
          const user2 = await UserController.update(user, req, res);
          const token = generateToken(user2);
          res.setHeader("Set-Cookie", `token=; HttpOnly; Path=/`);
          res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Path=/`);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "User registered successfully" }));
        } else {
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "User not confirmed" }));
        }
      }
    });
  } else if (path.match(/^\/users\/\w+$/) && method === "delete") {
    req.params = { id: path.split("/")[2] };
    await UserController.destroy(req, res);
  } else if (path === "/logout" && method === "post") {
    res.setHeader("Set-Cookie", `token=/; HttpOnly; Path=/`);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Logged out successfully" }));
  } else if (path === "/log-in" && method === "post") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      req.body = parseFormData(body);
      try {
        const user = await UserController.login(req, res);
        if (res.statusCode === 401) {
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Logs are incorrect" }));
          return;
        }
        const token = generateToken(user);
        res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Path=/`);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Login successful" }));
      } catch (err) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end();
      }
      return;
    });
  } else if (path === "/homepage" && method === "get") {
    const cookies = parseCookies(req);
    const token = cookies.token;
    // PictureController.createtest(req, res);
    if (token) {
      const user = verifyToken(token);
      if (user && user.user.confirmed === false) {
        fs.readFile(
          path2.join(__dirname, "../public/confirmation.html"),
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
      } else if (user && user.user.confirmed === true) {
        fs.readFile(
          path2.join(__dirname, "../public/Homepage.html"),
          (err, data) => {
            if (err) {
              res.writeHead(500, { "Content-Type": "text/plain" });
              res.end("Internal Server Error");
              return;
            }
            const updatedData = data.toString().replace(
              '<script src="js/gallery.js"></script>',
              `<script>
                const notif = {
                  notification: ${user.user.notification}
                };
                      document.addEventListener("DOMContentLoaded", function () {
        if (notif.notification)
          document.getElementById("myCheckbox").checked = true;
      });
              </script>
              <script src="js/gallery.js"></script>`
            );
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(updatedData);
          }
        );
      } else {
        res.writeHead(302, { Location: "/login" });
        res.end("Authentication failed");
      }
    } else {
      res.writeHead(302, { Location: "/login" });
      res.end();
    }
  } else if (path.match(/^\/confirm\/\w+$/) && method === "get") {
    const token = path.split("/")[2];
    try {
      await UserController.confirmEmail(res, token);
      res.writeHead(302, { Location: "/login" });
      res.end();
    } catch {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Invalid token");
    }
  } else if (path === "/forgot" && method === "get") {
    fs.readFile(path2.join(__dirname, "../public/forgot.html"), (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } else if (path === "/forgot" && method === "post") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      req.body = parseFormData(body);
      try {
        await UserController.resetpwd(res, req.body.username_or_email);
        if (res.statusCode === 401) {
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Logs are incorrect" }));
          return;
        }
      } catch (err) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end();
      }
    });
  } else if (path.match(/^\/reset\/\w+$/) && method === "get") {
    try {
      const token = path.split("/")[2];
      if (token) {
        const user = await UserController.checktoken(token);
        if (user) {
          fs.readFile(
            path2.join(__dirname, "../public/new_pwd.html"),
            (err, data) => {
              res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Path=/`);
              res.writeHead(200, { "Content-Type": "text/html" });
              res.end(data);
            }
          );
        }
      }
    } catch {
      res.writeHead(302, { Location: "/login" });
      res.end();
    }
  } else if (path === "/setnew-pwd" && method === "post") {
    const cookies = parseCookies(req);
    const token = cookies.token;
    if (token) {
      const user = verifyToken(token);
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", async () => {
        req.body = parseFormData(body);
        try {
          await UserController.resetpwd2(res, token, req.body.password);
          if (res.statusCode === 401) {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Logs are incorrect" }));
            return;
          }
          res.writeHead(302, { Location: "/login" });
          res.end();
        } catch (err) {}
      });
    }
  } else if (path === "/pictures" && method === "get") {
    const parsedUrl = url.parse(req.url, true);
    const page = parseInt(parsedUrl.query.page) || 1;
    const limit = 5;
    const pics = await PictureController.getPaginatedPictures(page, limit);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(pics));
  } else if (path === "/picture" && method === "post") {
  } else if (path.match(/^\/picture-details$/) && method === "get") {
    const pictureId = parsedUrl.query.id;
    if (!pictureId) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Missing picture ID" }));
      return;
    }
    fs.readFile(
      path2.join(__dirname, "../public/Picture.html"),
      async (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
          return;
        }
        try {
          const cookies = parseCookies(req);
          const token = cookies.token;
          if (token) {
            const user = verifyToken(token);
            const picture = await PictureController.getPictureDetails(
              req,
              res,
              pictureId
            );
            const check = picture.picture.likedBy.includes(user.user.username);
            const pictureHtml = data
              .toString()
              .replace(
                "{{pictureUrl}}",
                `/uploads/${picture.picture.pictureName}.jpg`
              )
              .replace("{{likesHtml}}", `${picture.picture.like}`)
              .replace(
                "<script></script>",
                `<script>
                const liked = ${picture.picture.likedBy.includes(
                  user.user.username
                )};
                      document.addEventListener("DOMContentLoaded", function () {
        if (liked)
          document.getElementById("like-checkbox").checked = true;
      });
              </script>`
              )
              .replace(
                "{{commentsHtml}}",
                picture.comments
                  .map((comment) => `<div class="comment">${comment}</div>`)
                  .join("")
              );
            // console.log("picture.comments", pictureHtml);
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(pictureHtml);
          }
        } catch (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
        }
      }
    );
  } else if (
    path.match(/^\/like\/\w+$/) &&
    (method === "post" || method === "delete")
  ) {
    console.log("like");
    const pictureId = path.split("/")[2];
    const cookies = parseCookies(req);
    const token = cookies.token;
    if (!pictureId) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Missing picture ID" }));
      return;
    }
    if (token) {
      const user = verifyToken(token);
      try {
        let a = await PictureController.likePicture(
          req,
          res,
          pictureId,
          user.user
        );
        console.log("laaaaaaaaaaaaaaaaaaaa ", a);
        res.end({location: "/picture-details?id=" + pictureId});
      } catch (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      }
    }
  } else if (path.match(/^\/comment\/\w+$/) && method === "post") {
    const pictureId = path.split("/")[2];
    const cookies = parseCookies(req);
    const token = cookies.token;
    if (!pictureId) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Missing picture ID" }));
      return;
    }
    if (token) {
      const user = verifyToken(token);
      PictureController.addComment(req, res, pictureId, user);
    }
  } else {
    res.writeHead(302, { Location: "/login" });
    res.end();
  }
};

module.exports = router;
