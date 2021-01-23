const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const ChatUser = sequelize.define("ChatUser", {
  name: Sequelize.TEXT,
  isModerator: Sequelize.BOOLEAN,
  uuid: Sequelize.TEXT,
});

module.exports = ChatUser;
