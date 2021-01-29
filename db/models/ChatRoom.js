const sequelize = require("../sequelize");
const { Sequelize } = sequelize;
const { Op } = Sequelize;

const ChatRoom = sequelize.define("ChatRoom", {
  event: Sequelize.INTEGER,
  isHidden: Sequelize.BOOLEAN,
  isDefault: Sequelize.BOOLEAN,
  name: Sequelize.TEXT,
  chatEnabled: { type: Sequelize.BOOLEAN, defaultValue: true },
  questionsEnabled: { type: Sequelize.BOOLEAN, defaultValue: true },
});

module.exports = ChatRoom;
