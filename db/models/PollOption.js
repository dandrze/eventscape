const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const PollOption = sequelize.define("PollOption", {
  text: Sequelize.TEXT,
});

module.exports = PollOption;
