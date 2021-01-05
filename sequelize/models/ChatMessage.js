const conn = require("../conn");
const { Sequelize } = conn;

const ChatMessage = conn.define("ChatMessage", {
  text: Sequelize.TEXT,
  deleted: Sequelize.BOOLEAN,
});

module.exports = ChatMessage;
