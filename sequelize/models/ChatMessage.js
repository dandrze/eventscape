const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const ChatMessage = sequelize.define("ChatMessage", {
  text: Sequelize.TEXT,
  deleted: Sequelize.BOOLEAN,
});

module.exports = ChatMessage;
