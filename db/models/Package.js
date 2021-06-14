const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const Package = sequelize.define("Package", {
  viewers: { type: Sequelize.INTEGER, defaultValue: 50 },
  streamingTime: { type: Sequelize.INTEGER, defaultValue: 1 },
});

module.exports = Package;
