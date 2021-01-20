const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const SiteVisit = sequelize.define("SiteVisit", {
  EventscapeId: Sequelize.INTEGER,
  loggedOutAt: Sequelize.DATE,
  uniqueVisitorId: Sequelize.TEXT,
});

module.exports = SiteVisit;
