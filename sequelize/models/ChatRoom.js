const conn = require("../conn");
const { Sequelize } = conn;
const { Op } = Sequelize;

const ChatRoom = conn.define(
  "ChatRoom",
  {
    event: Sequelize.INTEGER,
    hidden: Sequelize.BOOLEAN,
  },
  {
    tableName: "chat_room",
  }
);

module.exports = ChatRoom;
