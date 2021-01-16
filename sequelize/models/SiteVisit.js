const sequelize = require("..");
const conn = require("../conn");
const { Sequelize } = conn;

const SiteVisit = conn.define("SiteVisit", {
  EventscapeId: Sequelize.INTEGER,
  loggedOutAt: Sequelize.DATE,
  eventId: Sequelize.INTEGER,
  uniqueVisitorId: Sequelize.TEXT,
});

module.exports = SiteVisit;
