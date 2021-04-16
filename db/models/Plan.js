const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const Plan = sequelize.define("Plan", {
  viewers: { type: Sequelize.INTEGER, defaultValue: 50 },
  streamingTime: { type: Sequelize.INTEGER, defaultValue: 1 },
});

module.exports = Plan;
