const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const Account = sequelize.define("Account", {
  firstName: Sequelize.TEXT,
  lastName: Sequelize.TEXT,
  emailAddress: Sequelize.TEXT,
  password: Sequelize.TEXT,
});

module.exports = Account;
