const conn = require("../conn");
const { Sequelize } = conn;
const { Op } = Sequelize;

const ChatRoom = conn.define("ChatRoom", {
  event: Sequelize.INTEGER,
  isHidden: Sequelize.BOOLEAN,
  isDefault: Sequelize.BOOLEAN,
  name: Sequelize.TEXT,
});

module.exports = ChatRoom;
