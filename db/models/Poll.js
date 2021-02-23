const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const Poll = sequelize.define("Poll", {
  question: Sequelize.TEXT,
  allowMultiple: Sequelize.BOOLEAN,
  allowShare: Sequelize.BOOLEAN,
});

module.exports = Poll;
