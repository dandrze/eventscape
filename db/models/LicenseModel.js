const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const LicenseModel = sequelize.define("LicenseModel", {
  basePrice: Sequelize.INTEGER,
  basePriceWithCDN: Sequelize.INTEGER,
  pricePerViewer: Sequelize.DECIMAL(10, 2),
  pricePerViewerWithCDN: Sequelize.DECIMAL(10, 2),
  pricePerRegistration: Sequelize.DECIMAL(10, 2),
  pricePerRegistrationWithCDN: Sequelize.DECIMAL(10, 2),
  maxStreamingTime: Sequelize.INTEGER,
});

module.exports = LicenseModel;
