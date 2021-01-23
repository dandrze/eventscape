const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const ChatQuestion = sequelize.define("ChatQuestion", {
  text: Sequelize.TEXT,
  complete: Sequelize.BOOLEAN,
  isChecked: { type: Sequelize.BOOLEAN, defaultValue: false },
});

module.exports = ChatQuestion;
