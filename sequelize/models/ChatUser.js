const sequelize = require("..");
const conn = require("../conn");
const { Sequelize } = conn;

const ChatUser = conn.define("ChatUser", {
  name: Sequelize.TEXT,
  EventscapeId: Sequelize.INTEGER,
});

module.exports = ChatUser;
