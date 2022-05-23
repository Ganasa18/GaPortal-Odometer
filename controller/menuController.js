const db = require("../model");
const { Op } = require("sequelize");
const Menu = db.menus;
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllMenu = catchAsync(async (req, res, next) => {
  let name = req.params.menu_name;

  if (name)
    options = {
      where: {
        menu_name: {
          [Op.like]: `%${name}%`,
        },
      },
    };

  let options = {};

  const menus = await Menu.findAll(options);

  if (menus == "") {
    return next(new AppError("No menus found"));
  }

  res.status(200).json({
    status: "success",
    data: {
      menus,
    },
  });
});

exports.createMenu = catchAsync(async (req, res, next) => {
  const menu = await Menu.create(req.body);
  res.status(200).json({
    status: "success created",
    data: {
      menu,
    },
  });
});
