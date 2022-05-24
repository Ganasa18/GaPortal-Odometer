const express = require("express");
const userController = require("../controller/userController");
const authController = require("../controller/authController");
const router = express.Router();

router.route("/login-web").post(authController.loginWeb);
router.route("/login-mobile").post(authController.loginMobile);

router
  .route("/")
  .get(userController.getAllUser)
  .post(userController.createUser);

router.route("/edit/:uuid").patch(userController.updatedUser);
router.route("/delete/:uuid").patch(userController.deleteUser);

module.exports = router;
