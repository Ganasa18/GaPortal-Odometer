// import module
const dotenv = require("dotenv");

// Error Exception
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({
  path: "./config.env",
});

const app = require("./app");

// server setting
const port = 1010;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Handle rejection error
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
