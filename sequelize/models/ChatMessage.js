const conn = require("../conn");
const { Sequelize } = conn;

const ChatMessage = conn.define(
  "ChatMessage",
  {
    text: Sequelize.TEXT,
  },
  {
    tableName: "chat_message",
  }
);

module.exports = ChatMessage;
