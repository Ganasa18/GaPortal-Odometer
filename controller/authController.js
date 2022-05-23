const db = require("../model");
const { Op } = require("sequelize");
const User = db.users;
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const signToken = (userWithEmail) => {
  return jwt.sign(
    {
      id: userWithEmail.id,
      uuid: userWithEmail.uuid,
      role: userWithEmail.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

const createSendToken = (userWithEmail, statusCode, res) => {
  const token = signToken(userWithEmail);
  //   option jwt
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
  // hapus password dari output
  userWithEmail.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: userWithEmail,
    },
  });
};

exports.loginWeb = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  //  Check jika username dan password terisi
  if (!username || !password) {
    return next(new AppError("Please provide username and password!", 400));
  }

  const userWithEmail = await User.findOne({
    where: {
      username: username,
    },
  }).catch((err) => {
    console.log("Error", err);
  });

  if (!userWithEmail) {
    return next(new AppError("Incorrect username or password", 401));
  }

  //  Check password match

  const realPassword = bcrypt.compareSync(password, userWithEmail.password);
  if (!realPassword) {
    return next(new AppError("Incorrect username or password", 401));
  }

  //Jika semua kondisi terpenuhi send token
  createSendToken(userWithEmail, 200, res);
});

exports.loginMobile = catchAsync(async (req, res, next) => {
  const phoneNumber = req.body.phoneNumber;
  const password = "123";

  //  Check jika email dan password terisi
  if (!phoneNumber) {
    return next(new AppError("Please provide phoneNumber!", 400));
  }

  const userWithEmail = await User.findOne({
    where: {
      phoneNumber: phoneNumber,
    },
  }).catch((err) => {
    console.log("Error", err);
  });

  console.log(userWithEmail.role);

  if (userWithEmail.role == "ADMIN") {
    return next(new AppError("Cannot login this feature ", 401));
  }

  if (!userWithEmail) {
    return next(new AppError("Incorrect phone number", 401));
  }

  //  Check password match

  const realPassword = bcrypt.compareSync(password, userWithEmail.password);
  if (!realPassword) {
    return next(new AppError("Incorrect phoneNumber", 401));
  }

  //Jika semua kondisi terpenuhi send token
  createSendToken(userWithEmail, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findByPk(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});
