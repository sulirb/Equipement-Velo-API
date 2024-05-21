const express = require("express");
require("dotenv").config();
const cors = require("cors");
require("express-async-errors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const { errorMiddleware } = require("./middlewares/error.js");

const app = express();

const mongoDatabase = process.env.MONGODB_NAME;

mongoose
  .connect(mongoDatabase, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.log("Connexion à MongoDB échouée !" + error));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static("./images"));
app.use(helmet());
app.use(mongoSanitize());
app.use(morgan("dev", { immediate: true }));
app.use(morgan("dev"));
app.use(require("./router/index.js"));
app.use(errorMiddleware);

module.exports = app;
