const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const Permission = sequelize.define("Permission", {
  role: Sequelize.TEXT,
  eventDetails: Sequelize.BOOLEAN,
  design: Sequelize.BOOLEAN,
  communication: Sequelize.BOOLEAN,
  registration: Sequelize.BOOLEAN,
  polls: Sequelize.BOOLEAN,
  analytics: Sequelize.BOOLEAN,
  messaging: Sequelize.BOOLEAN,
});

module.exports = Permission;
