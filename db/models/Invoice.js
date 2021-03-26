const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const Invoice = sequelize.define("Invoice", {
  description: Sequelize.TEXT,
});

module.exports = Invoice;
