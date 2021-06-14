const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const PackageType = sequelize.define("PackageType", {
  name: Sequelize.TEXT,
  fixedPrice: { type: Sequelize.FLOAT, defaultValue: 250 },
  pricePerViewerHour: { type: Sequelize.FLOAT, defaultValue: 0.1 },
  description: { type: Sequelize.TEXT, defaultValue: "Default" },
  type: { type: Sequelize.TEXT },
});

module.exports = PackageType;
