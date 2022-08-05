const express = require("express");
const authController = require("../controller/authController");
const locationController = require("../controller/locationController");

const router = express.Router();

router
  .route("/")
  .get(locationController.getAllLocation)
  .post(locationController.createLocation);

module.exports = router;
