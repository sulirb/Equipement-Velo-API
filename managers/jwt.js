require("dotenv").config();
const jwt = require("jsonwebtoken");

const sectok = process.env.JWT_SECRET;
const exptok = process.env.JWT_EXPIRE;

const verify = (token) => jwt.verify(token, sectok);
const sign = (data) => jwt.sign(data, sectok, { expiresIn: exptok });

module.exports = { verify, sign };
