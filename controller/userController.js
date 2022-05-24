const db = require("../model");
const { Op } = require("sequelize");
const User = db.users;
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

exports.getAllUser = catchAsync(async (req, res, next) => {
  let username = req.query.username;
  let phoneNumber = req.query.phoneNumber;
  let role = req.query.role;
  let area = req.query.area;
  let departement = req.query.departement;

  let options = {};

  // Execute Query

  if (username)
    options = {
      where: {
        username: {
          [Op.like]: `%${username}%`,
        },
      },
    };

  if (phoneNumber)
    options = {
      raw: true,
      where: {
        phoneNumber,
      },
    };
  if (role)
    options = {
      raw: true,
      where: {
        role,
      },
    };
  if (area)
    options = {
      raw: true,
      where: {
        area,
      },
    };

  if (username && area)
    options = {
      where: {
        username: {
          [Op.like]: `%${username}%`,
        },
        area,
      },
    };

  if (username && role)
    options = {
      where: {
        username: {
          [Op.like]: `%${username}%`,
        },
        role,
      },
    };
  if (area && departement)
    options = {
      where: {
        area,
        departement,
      },
    };

  const users = await User.findAll(options);
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

exports.createUser = catchAsync(async (req, res, next) => {
  const data = {
    username: req.body.username,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    area: req.body.area,
    departement: req.body.departement,
    role: req.body.role,
    is_active: true,
    password: req.body.password,
  };

  const userFind = await User.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (userFind) {
    return next(new AppError("User with this email already exists", 422));
  }

  const user = await User.create(data);
  res.status(200).json({
    status: "success created",
    data: {
      user,
    },
  });
});

exports.updatedUser = catchAsync(async (req, res, next) => {
  const uuid = req.params.uuid;

  const checkuser = await User.findAll({
    where: {
      uuid: uuid,
    },
  });

  if (checkuser == null) {
    return next(new AppError("Edit must with valid ID", 400));
  }

  const salt = bcrypt.genSaltSync(10);
  const password = req.body.password;
  const hashPassword = bcrypt.hashSync(password, salt);
  const data = {
    username: req.body.username,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    area: req.body.area,
    departement: req.body.departement,
    role: req.body.role,
    is_active: req.body.is_active,
    password: hashPassword,
  };

  await User.update(data, {
    where: {
      uuid: uuid,
    },
  });

  res.status(200).json({
    status: "success updated",
    data: {
      user: `updated success ${req.body.username}`,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const uuid = req.params.uuid;

  const data = {
    is_active: req.body.is_active,
  };

  const checkuser = await User.findAll({
    where: {
      uuid: uuid,
    },
  });

  if (checkuser == null) {
    return next(new AppError("Edit must with valid ID", 400));
  }

  await User.update(data, {
    where: {
      uuid: uuid,
    },
  });

  res.status(200).json({
    status: "success updated",
    data: {
      user: `delete success`,
    },
  });
});
