// import module
const dbConfig = require("../config/database.js");
const Sequelize = require("sequelize");

// Initial Database
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.users = require("./modelUser.js")(sequelize, Sequelize);
db.roles = require("./modelRole.js")(sequelize, Sequelize);
db.areas = require("./modelArea.js")(sequelize, Sequelize);
db.departements = require("./modelDepartement.js")(sequelize, Sequelize);
db.menus = require("./modelMenu.js")(sequelize, Sequelize);

// db.sequelize.sync({});

module.exports = db;
