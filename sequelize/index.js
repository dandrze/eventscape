const conn = require("./conn");
const ChatMessage = require("./models/ChatMessage");
const ChatRoom = require("./models/ChatRoom");
const ChatUser = require("./models/ChatUser");

ChatMessage.belongsTo(ChatUser);
ChatMessage.belongsTo(ChatRoom);
ChatRoom.hasMany(ChatMessage);
ChatUser.hasMany(ChatMessage);
/*
ChatUser.sync({ alter: true });
ChatRoom.sync({ alter: true });
ChatMessage.sync({ alter: true });
*/

module.exports = {
  conn,
  models: {
    ChatMessage,
    ChatRoom,
    ChatUser,
  },
};
