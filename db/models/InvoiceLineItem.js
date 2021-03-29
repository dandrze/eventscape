const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const InvoiceLineItem = sequelize.define("InvoiceLineItem", {
  type: Sequelize.TEXT,
});

module.exports = InvoiceLineItem;
