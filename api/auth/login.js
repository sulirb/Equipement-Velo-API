const User = require("../../models/User.js");
const jwt = require("../../managers/jwt.js");
const express = require("express");
const bcrypt = require("bcrypt");
const { HttpError } = require("../../middlewares/error.js");

let route = express.Router({ mergeParams: true });
const LOGIN_ERROR = "Paire login/mot de passe incorrecte";
const CODE_ERROR = "Code incorrect";

route.post("/", async (req, res) => {
  const { username, password, code } = req.body;
  const user = await User.findOne({ username });
  if (!user) throw new HttpError(401, LOGIN_ERROR);

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new HttpError(401, LOGIN_ERROR);

  const confidentialCode = await User.findOne({ code });
  if (!confidentialCode) throw new HttpError(401, CODE_ERROR);

  const userId = user._id;
  res.status(200).json({ userId, token: jwt.sign({ userId }) });
});

module.exports = route;
