const db = require("../model");
const { Op } = require("sequelize");
const Area = db.areas;
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllArea = catchAsync(async (req, res, next) => {
  const areas = await Area.findAll({
    order: [["id", "DESC"]],
  });

  if (areas == "") {
    return next(new AppError("No area found"));
  }

  res.status(200).json({
    status: "success",
    data: {
      areas,
    },
  });
});

exports.createArea = catchAsync(async (req, res, next) => {
  const area = await Area.create(req.body);
  res.status(200).json({
    status: "success created",
    data: {
      area,
    },
  });
});
