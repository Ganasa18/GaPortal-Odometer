const express = require("express");
const userController = require("../controller/userController.js");
const router = express.Router();

router.route("/user").get(userController.getAllUser);

module.exports = router;
