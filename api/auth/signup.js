const User = require("../../models/User.js");
const express = require("express");
const bcrypt = require("bcrypt");
const { HttpError } = require("../../middlewares/error.js");

let route = express.Router({ mergeParams: true });

route.post("/", async (req, res) => {
  try {
    const { username, password, code } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hash, code });
    await user.save();
    res.status(201).json({ message: "Utilisateur créé" });
  } catch (error) {
    console.error(error);
    throw new HttpError(500, { error });
  }
});

module.exports = route;
