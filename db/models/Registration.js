const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const Registration = sequelize.define("Registration", {
  emailAddress: Sequelize.TEXT,
  firstName: Sequelize.TEXT,
  lastName: Sequelize.TEXT,
  values: { type: Sequelize.JSONB, defaultValue: [] },
  hash: Sequelize.TEXT,
});

module.exports = Registration;
