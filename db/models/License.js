const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const License = sequelize.define("License", {
  basePrice: Sequelize.INTEGER,
  pricePerViewer: Sequelize.DECIMAL(10, 2),
  pricePerRegistration: Sequelize.DECIMAL(10, 2),
  maxStreamingTime: { type: Sequelize.INTEGER, defaultValue: 4 },
  includeCDN: Sequelize.BOOLEAN,
});

module.exports = License;
