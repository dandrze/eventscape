const conn = require("../conn");
const { Sequelize } = conn;

const ChatUser = conn.define(
  "ChatUser",
  {
    name: Sequelize.TEXT,
  },
  {
    tableName: "chat_user",
  }
);

module.exports = ChatUser;
