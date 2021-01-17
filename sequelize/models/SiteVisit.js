const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const SiteVisit = sequelize.define("SiteVisit", {
  EventscapeId: Sequelize.INTEGER,
  loggedOutAt: Sequelize.DATE,
  eventId: Sequelize.INTEGER,
  uniqueVisitorId: Sequelize.TEXT,
});

module.exports = SiteVisit;
