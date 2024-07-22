const User = require("../models/User");
const crypto = require("crypto");
const validator = require("../components/validator");
const resetor = require("../components/resetor");

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

function generateConfirmationToken() {
  return crypto.randomBytes(32).toString("hex");
}

const create = async (req, res) => {
  new_mdp = hashPassword(req.body.password);
  let user = new User({
    username: req.body.username,
    email: req.body.email,
    password: new_mdp.hash,
    salt: new_mdp.salt,
  });
  const user2 = await User.findOne({
    $or: [{ username: user.username }, { email: user.email }],
  });
  if (user2) {
    throw new Error("already exists");
  }
  user.confirmationToken = generateConfirmationToken();
  await user.save();
  console.log(user, "user created successfully!");
  await validator(user.email, user.confirmationToken);
  return user;
};

const login = async (req, res) => {
  try {
    const { username_or_email, password } = req.body;
    const user = await User.findOne({
      $or: [{ username: username_or_email }, { email: username_or_email }],
    });
    if (!user) {
      res.writeHead(401, { "Content-Type": "text/plain" });
      res.end("Authentication failed");
      return;
    }
    const isPasswordCorrect = verifyPassword(
      password,
      user.salt,
      user.password
    );
    if (isPasswordCorrect) {
      return user;
    } else {
      res.writeHead(401, { "Content-Type": "text/plain" });
    }
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
};

const update = async (user, req, res) => {
  try {
    const user2 = await User.findOne(user.username);
    if (req.body.new_username) user2.username = req.body.new_username;
    if (req.body.new_email) user2.email = req.body.new_email;
    if (req.body.new_password) {
      const new_mdp = hashPassword(req.body.new_password);
      user2.password = new_mdp.hash;
      user2.salt = new_mdp.salt;
    }
    await user2.save();
    res.writeHead(401, { "Content-Type": "text/plain" });
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

const confirmEmail = async (res, token) => {
  const user = await User.findOne({ confirmationToken: token });
  if (!user) {
    throw new Error("User not found");
  }
  user.confirmed = true;
  user.confirmationToken = null;
  await user.save();
};

const resetpwd = async (res, email) => {
  const user = await User.findOne({ email: email });
  user.confirmationToken = generateConfirmationToken();
  user.save();
  await resetor(email, user.confirmationToken);
};

const resetpwd2 = async (res, token, password) => {
  const user = await User.findOne({ confirmationToken: token });
  if (!user) {
    throw new Error("User not found");
  }
  user.confirmationToken = null;
  const new_mdp = hashPassword(password);
  user.password = new_mdp.hash;
  user.salt = new_mdp.salt;
  user.save();
  console.log(user, "user updated successfully!");
};

const checktoken = async (token) => {
  const user = await User.findOne({ confirmationToken: token });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
// test function
// const createtest = async (req, res) => {
//   try {
//     let user = new User({
//       username: "pierre",
//       email: "req.body.email",
//       password: "req.body.password",

//     });
//     user.save();
//     console.log(user, "user created successfully!");
//     res.writeHead(201).json(user);
//     res.end(JSON.stringify(user));
//   } catch (err) {
//     console.log(err.message);
//     res.writeHead(500, { "Content-Type": "text/plain" });
//     res.end("Internal Server Error");
//   }
// };

module.exports = {
  index,
  show,
  login,
  confirmEmail,
  resetpwd,
  resetpwd2,
  checktoken,
  create,
  update,
  destroy,
};
