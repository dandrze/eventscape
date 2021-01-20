const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const SiteVisit = sequelize.define("SiteVisit", {
  loggedOutAt: Sequelize.DATE,
});

module.exports = SiteVisit;
