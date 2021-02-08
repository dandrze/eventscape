const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const Account = sequelize.define("Account", {
  firstName: Sequelize.TEXT,
  lastName: Sequelize.TEXT,
  emailAddress: Sequelize.TEXT,
  password: Sequelize.TEXT,
});

/*
Account.findByPkCached = async function (pk) {
  console.log("cached called");

  return await this.findByPk(pk);
};
*/

module.exports = Account;
