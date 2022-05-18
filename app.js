// import module
const cookieParser = require("cookie-parser");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");
const Sequelize = require("sequelize");
const dbConfig = require("./config/database.js");

// Initial express
const app = express();

// Handler Error
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");

// Check Connection DB
var checkdb = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  logging: false,
});

checkdb
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Set security HTTP headers
app.use(helmet());
app.use(cors());

// Limit requests from same API
const limiter = rateLimit({
  max: 20,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

// Body parser, reading data from body into req.body
app.use(
  express.json({
    limit: "10kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

// Data sanitization against XSS
app.use(xss());

// Routes

// Handle Not Found
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global Handler
app.use(globalErrorHandler);

module.exports = app;
