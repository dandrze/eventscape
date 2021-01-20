const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const RegistrationForm = sequelize.define("RegistrationForm", {
  data: Sequelize.JSONB,
});

module.exports = RegistrationForm;
