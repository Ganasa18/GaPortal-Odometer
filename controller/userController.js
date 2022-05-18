const db = require("../model");
const User = db.users;
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    order: [["id", "DESC"]],
  });

  if (users == "") {
    return next(new AppError("No User Found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});
