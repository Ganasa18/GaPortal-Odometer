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
  const data = {
    menu_name: req.body.menu_name,
    menu_url: req.body.menu_url,
    menu_icon: req.body.menu_icon,
  };
  const menu = await Menu.create(data);
  res.status(200).json({
    status: "success created",
    data: {
      menu,
    },
  });
});

exports.editMenu = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const data = {
    menu_name: req.body.menu_name,
    menu_url: req.body.menu_url,
    menu_icon: req.body.menu_icon,
  };

  await Menu.update(data, {
    where: {
      id: id,
    },
  });
  const checkmenu = await Menu.findByPk(id);

  if (checkmenu == null) {
    return next(new AppError("Edit must with valid ID", 400));
  }
  res.status(200).json({
    status: "success updated",
    data: {
      role: `updated with id = ${id}`,
    },
  });
});

exports.deleteMenu = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const data = {
    is_deleted: req.body.is_deleted,
  };

  await Menu.update(data, {
    where: {
      id: id,
    },
  });
  const checkmenu = await Menu.findByPk(id);

  if (checkmenu == null) {
    return next(new AppError("Edit must with valid ID", 400));
  }
  res.status(200).json({
    status: "success deleted",
    data: {
      role: `deleted with id = ${id}`,
    },
  });
});
