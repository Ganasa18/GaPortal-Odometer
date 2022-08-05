const db = require("../model");
const Report = db.reports;
const { Op } = require("sequelize");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const sharp = require("sharp");
const convertTZ = require("../utils/convertDate");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadOdometerPhoto = upload.single("picture_odometer");

exports.resizeRequestPhoto = catchAsync(async (req, res, next) => {
  // console.log(req.file);
  if (!req.file) return next();

  req.file.filename = `odometer-image-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .toFormat("jpeg")
    .jpeg({
      quality: 90,
    })
    .toFile(`public/image/odometer/${req.file.filename}`);
  next();
});

exports.getAllReport = catchAsync(async (req, res, next) => {
  const reports = await Report.findAll({
    order: [["id", "DESC"]],
  });

  if (reports == "") {
    return next(new AppError("No report found"));
  }

  res.status(200).json({
    status: "success",
    data: {
      reports,
    },
  });
});

exports.createReport = catchAsync(async (req, res, next) => {
  const data = {
    user_name: req.body.username,
    plate_car: req.body.plate_car,
    car_name: req.body.car_name,
    departement: req.body.departement,
    area: req.body.area,
    km_awal: parseInt(req.body.odometer),
    picture_1: !req.file ? null : `public/image/odometer/${req.file.filename}`,
  };

  const report = await Report.create(data);
  res.status(200).json({
    status: "success created",
    data: {
      report,
    },
  });
});

exports.checkTodayReport = catchAsync(async (req, res, next) => {
  const TODAY_START = new Date().setHours(0, 0, 0, 0);
  const NOW = new Date();
  const username = req.params.username;
  let today = 0;
  const check = await Report.findAll({
    where: {
      user_name: username,
      createdAt: {
        [Op.gt]: TODAY_START,
        [Op.lt]: NOW,
      },
    },
  });

  if (check.length == 0) {
    today = 1;
    res.status(200).json({
      count: today,
      status: "no created data",
    });
    return;
  }

  if (check.length > 0) {
    if (check[0].km_akhir == null) {
      today = 2;
      res.status(200).json({
        status: "no data km 2",
        count: today,
        data: {
          check,
        },
      });
      return;
    }

    if (check[0].km_akhir != null && check[0].location == null) {
      today = 3;
      res.status(200).json({
        status: "no data location",
        count: today,
        data: {
          check,
        },
      });
      return;
    }

    if (check[0].location != null) {
      today = 4;
      res.status(200).json({
        status: "today complete",
        count: today,
        data: {
          check,
        },
      });
    }
    return;
  }
});

exports.updateKilometer = catchAsync(async (req, res, next) => {
  const TODAY_START = new Date().setHours(0, 0, 0, 0);
  const NOW = new Date();
  const nowDate = convertTZ(NOW, "Asia/Jakarta");

  const data = {
    user_name: req.body.username,
    picture_2: !req.file ? null : `public/image/odometer/${req.file.filename}`,
    km_akhir: parseInt(req.body.odometer),
    updateAt: nowDate,
  };

  // console.log(data);

  await Report.update(data, {
    where: {
      user_name: req.body.username,
      createdAt: {
        [Op.gt]: TODAY_START,
        [Op.lt]: NOW,
      },
    },
  });

  res.status(200).json({
    status: "success",
  });
});
