const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const Account = sequelize.define("Account", {
  firstName: Sequelize.TEXT,
  lastName: Sequelize.TEXT,
  emailAddress: Sequelize.TEXT,
  password: Sequelize.TEXT,
  currentEventId: Sequelize.INTEGER,
  registrationComplete: { type: Sequelize.BOOLEAN, defaultValue: false },
});

module.exports = Account;
