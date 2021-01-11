var socketIo = require("socket.io");
const conn = require("../sequelize").conn;
const { ChatRoom, ChatUser, ChatMessage } = require("../sequelize").models;

module.exports = (server) => {
  const io = socketIo(server, {
    path: "/api/socket",
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("join", async ({ userId, name, room }, callback) => {
      console.log(userId, name, room)
      const chatRoom = await ChatRoom.findByPk(room);

      const messageHistory = await ChatMessage.findAll({
        where: { ChatRoomId: room },
        include: ChatUser,
      });

      var user;
      var created;

      if (!userId) {
        user = await ChatUser.create({ name });
      } else {
        [user, created] = await ChatUser.findOrCreate({
          where: {
            EventscapeId: userId || null,
          },
        });

        if (created) {
          user.name = name;
          user.save();
        }
      }

      socket.join(room);
      // push the hidden state (true or false)
      if (chatRoom) socket.emit("chatHidden", chatRoom.isHidden);

      socket.emit("notification", {
        text: "Hello " + name + ".You are now connected to room " + room,
      });

      //push the message history
      messageHistory.forEach((message) => {
        socket.emit("message", {
          user: message.ChatUser.name,
          text: message.text,
          id: message.id,
          deleted: message.deleted,
          userId: message.ChatUser.id,
        });
      });

      callback(user.id);
    });

    socket.on("sendMessage", async ({ userId, room, message }, callback) => {
      const chatUser = await ChatUser.findOne({ where: { id: userId } });

      const chatMessage = await ChatMessage.create({
        ChatRoomId: room,
        text: message,
        ChatUserId: chatUser.id,
      });

      io.to(room).emit("message", {
        user: chatUser.name,
        userId: chatUser.id,
        text: message,
        id: chatMessage.id,
      });

      callback();
    });

    socket.on("setChatHidden", async ({ isHidden, room }) => {
      const chatRoom = await ChatRoom.findByPk(room);

      chatRoom.isHidden = isHidden;
      await chatRoom.save();

      io.to(room).emit("chatHidden", isHidden);
    });

    socket.on("deleteMessage", async ({ id, room }) => {
      const chatMessage = await ChatMessage.findByPk(id);
      chatMessage.deleted = true;
      chatMessage.save();

      io.to(room).emit("delete", id);
    });

    socket.on("restoreMessage", ({ id, room }) => {
      io.to(room).emit("restore", id);
    });

    socket.on("deleteAllMessages", async ({ room }) => {
      const chatMessage = await ChatMessage.update(
        { deleted: true },
        { where: { ChatRoomId: room } }
      );

      io.to(room).emit("deleteAll");
    });

    socket.on("disconnect", (reason) => {
      console.log("Client disconnected: " + reason);
    });
  });
};
