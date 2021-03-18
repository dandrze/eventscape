const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const Permission = sequelize.define("Permission", {
  role: { type: Sequelize.TEXT, defaultValue: "collaborator" },
  eventDetails: { type: Sequelize.BOOLEAN, defaultValue: false },
  design: { type: Sequelize.BOOLEAN, defaultValue: true },
  communication: { type: Sequelize.BOOLEAN, defaultValue: true },
  registration: { type: Sequelize.BOOLEAN, defaultValue: true },
  polls: { type: Sequelize.BOOLEAN, defaultValue: true },
  analytics: { type: Sequelize.BOOLEAN, defaultValue: true },
  messaging: { type: Sequelize.BOOLEAN, defaultValue: true },
});

module.exports = Permission;
