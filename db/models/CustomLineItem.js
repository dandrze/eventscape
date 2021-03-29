const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const CustomLineItem = sequelize.define("CustomLineItem", {
  description: Sequelize.TEXT,
  cost: Sequelize.FLOAT,
  quantity: Sequelize.INTEGER,
  unitType: Sequelize.TEXT,
});

module.exports = CustomLineItem;
