const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const PlanType = sequelize.define("PlanType", {
  name: Sequelize.TEXT,
  fixedPrice: { type: Sequelize.FLOAT, defaultValue: 250 },
  pricePerViewerHour: { type: Sequelize.FLOAT, defaultValue: 0.1 },
  description: { type: Sequelize.TEXT, defaultValue: "Default" },
  type: { type: Sequelize.TEXT },
});

module.exports = PlanType;
