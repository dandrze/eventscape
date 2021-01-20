const { statusOptions } = require("../../model/enums");
const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const Event = sequelize.define("Event", {
  title: Sequelize.TEXT,
  link: Sequelize.TEXT,
  category: Sequelize.TEXT,
  timeZone: Sequelize.TEXT,
  primaryColor: Sequelize.TEXT,
  isCurrent: Sequelize.BOOLEAN,
  startDate: Sequelize.DATE,
  endDate: Sequelize.DATE,
  hasRegistration: Sequelize.BOOLEAN,
  status: { type: Sequelize.TEXT, defaultValue: statusOptions.DRAFT },
});

module.exports = Event;
