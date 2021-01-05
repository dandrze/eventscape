const conn = require("./conn");
const ChatMessage = require("./models/ChatMessage");
const ChatRoom = require("./models/ChatRoom");
const ChatUser = require("./models/ChatUser");

ChatMessage.belongsTo(ChatUser);
ChatMessage.belongsTo(ChatRoom);
ChatRoom.hasMany(ChatMessage);
ChatRoom.hasMany(ChatUser);
ChatUser.hasMany(ChatMessage);
ChatUser.hasMany(ChatRoom);

/*
ChatMessage.sync({ alter: true });
ChatUser.sync({ alter: true });
ChatRoom.sync({ alter: true });
*/

module.exports = {
  conn,
  models: {
    ChatMessage,
    ChatRoom,
    ChatUser,
  },
};
