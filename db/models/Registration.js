const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const Registration = sequelize.define("Registration", {
  emailAddress: Sequelize.TEXT,
  firstName: Sequelize.TEXT,
  lastName: Sequelize.TEXT,
  values: Sequelize.JSONB,
  hash: Sequelize.TEXT,
});

module.exports = Registration;
