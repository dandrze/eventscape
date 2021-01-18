const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const Event = sequelize.define("Event", {
  title: Sequelize.TEXT,
  link: Sequelize.TEXT,
  category: Sequelize.TEXT,
  timeZone: Sequelize.TEXT,
  primaryColor: Sequelize.TEXT,
  isCurrent: Sequelize.TEXT,
  startDate: Sequelize.DATE,
  endDate: Sequelize.DATE,
  hasRegistration: Sequelize.TEXT,
  status: Sequelize.TEXT,
});

module.exports = Event;
