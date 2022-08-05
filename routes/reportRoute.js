const express = require("express");
const router = express.Router();
const reportController = require("../controller/reportController");

router
  .route("/")
  .get(reportController.getAllReport)
  .post(
    reportController.uploadOdometerPhoto,
    reportController.resizeRequestPhoto,
    reportController.createReport
  );

router.route("/today/:username").get(reportController.checkTodayReport);
router
  .route("/update-kilometer")
  .patch(
    reportController.uploadOdometerPhoto,
    reportController.resizeRequestPhoto,
    reportController.updateKilometer
  );

module.exports = router;
