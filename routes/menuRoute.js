const express = require("express");
const authController = require("../controller/authController");
const menuController = require("../controller/menuController");

const router = express.Router();

router
  .route("/")
  .get(menuController.getAllMenu)
  .post(menuController.createMenu);

module.exports = router;
