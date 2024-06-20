const User = require("../models/User");
const crypto = require("crypto");

const index = async (req, res) => {
  try {
    const users = await User.find({});
    console.log(users, "users");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
};

const show = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
};

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");

  return {
    salt: salt,
    hash: hash,
  };
}

function verifyPassword(password, salt, hash) {
  const hashToVerify = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return hash === hashToVerify;
}

const create = async (req, res) => {
  try {
    new_mdp = hashPassword(req.body.password);
    let user = new User({
      username: req.body.username,
      email: req.body.email,
      password: new_mdp.hash,
      salt: new_mdp.salt,
    });
    user.save();
    console.log(user, "user created successfully!");
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
  } catch (err) {
    if (err.code === 11000) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Username or Email already exists" }));
    } else {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    }
  }
};

const update = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    // user.username = req.body.username;
    // user.email = req.body.email;
    // user.password = req.body.password;
    user.save();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
};

const destroy = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.delete();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
};

// test function
const createtest = async (req, res) => {
  try {
    let user = new User({
      username: "pierre",
      email: "req.body.email",
      password: "req.body.password",
    });
    user.save();
    console.log(user, "user created successfully!");
    res.writeHead(201).json(user);
    res.end(JSON.stringify(user));
  } catch (err) {
    console.log(err.message);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
};

module.exports = {
  index,
  show,
  createtest,
  create,
  update,
  destroy,
};
