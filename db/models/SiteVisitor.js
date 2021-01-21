const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const SiteVisitor = sequelize.define("SiteVisitor", {
  name: Sequelize.TEXT,
  uuid: Sequelize.TEXT,
  city: Sequelize.TEXT,
  country: Sequelize.TEXT,
  countryCode: Sequelize.TEXT,
  lat: Sequelize.FLOAT,
  long: Sequelize.FLOAT,
});

module.exports = SiteVisitor;
