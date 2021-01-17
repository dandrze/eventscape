const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const ChatUser = sequelize.define("ChatUser", {
  name: Sequelize.TEXT,
  EventscapeId: Sequelize.INTEGER,
  isModerator: Sequelize.BOOLEAN,
});

module.exports = ChatUser;
