const sequelize = require("../sequelize");
const { Sequelize } = sequelize;
const { Op } = Sequelize;

const ChatRoom = sequelize.define("ChatRoom", {
  event: Sequelize.INTEGER,
  isHidden: Sequelize.BOOLEAN,
  isDefault: Sequelize.BOOLEAN,
  name: Sequelize.TEXT,
});

module.exports = ChatRoom;
