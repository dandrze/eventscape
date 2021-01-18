const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const EmailListRecipient = sequelize.define("EmailListRecipient", {
  firstName: Sequelize.TEXT,
  lastName: Sequelize.TEXT,
  email: Sequelize.TEXT,
  hash: Sequelize.TEXT,
});

module.exports = EmailListRecipient;
