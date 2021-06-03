const { statusOptions } = require("../../model/enums");
const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const Event = sequelize.define("Event", {
  title: Sequelize.TEXT,
  link: Sequelize.TEXT,
  category: Sequelize.TEXT,
  timeZone: Sequelize.TEXT,
  primaryColor: Sequelize.TEXT,
  startDate: Sequelize.DATE,
  endDate: Sequelize.DATE,
  registrationRequired: Sequelize.BOOLEAN,
  status: { type: Sequelize.TEXT, defaultValue: statusOptions.DRAFT },
  description: Sequelize.TEXT,
  maxDevicesEnabled: Sequelize.BOOLEAN,
  maxDevices: Sequelize.INTEGER,
  geoFencingEnabled: Sequelize.BOOLEAN,
});

module.exports = Event;
