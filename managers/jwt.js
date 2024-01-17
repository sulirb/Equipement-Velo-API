const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRE } = require("./env.js");

const verify = (token) => jwt.verify(token, JWT_SECRET);
const sign = (data) => jwt.sign(data, JWT_SECRET, { expiresIn: JWT_EXPIRE });

module.exports = { verify, sign };
