const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const License = sequelize.define("License", {
  basePrice: { type: Sequelize.INTEGER, defaultValue: 99 },
  pricePerViewer: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0.99 },
  maxStreamingTime: { type: Sequelize.INTEGER, defaultValue: 4 },
  type: Sequelize.TEXT,
  includeCDN: Sequelize.BOOLEAN,
});

module.exports = License;
