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

    socket.on("join", async ({ name, room }, callback) => {
      const chatRoom = await ChatRoom.findByPk(room);

      const [user] = await ChatUser.findOrCreate({
        where: {
          name,
        },
      });

      socket.join(room);
      // push the hidden state (true or false)
      console.log(chatRoom.id);
      console.log(chatRoom.isHidden);
      io.emit("chatHidden", chatRoom.isHidden);

      socket.emit("message", {
        user: "host",
        text: `${user.name}, welcome to room ${room}.`,
      });

      socket.broadcast
        .to(user.ChatRoomId)
        .emit("message", { user: "host", text: `${user.name} has joined!` });

      callback();
    });

    socket.on("sendMessage", async ({ name, room, message }, callback) => {
      const chatRoom = await ChatRoom.findByPk(room);

      const chatMessage = await ChatMessage.create({
        ChatRoomId: room,
        text: message,
      });

      io.to(room).emit("message", {
        user: name,
        text: message,
        id: chatMessage.id,
      });

      callback();
    });

    socket.on("setChatHidden", async ({ isHidden, room }) => {
      const chatRoom = await ChatRoom.findByPk(room);

      chatRoom.isHidden = isHidden;
      await chatRoom.save();

      console.log(isHidden);
      console.log(room);
      io.to(room).emit("chatHidden", isHidden);
    });

    socket.on("deleteMessage", ({ id, room }) => {
      io.to(room).emit("delete", id);
    });

    socket.on("restoreMessage", ({ id, room }) => {
      io.to(room).emit("restore", id);
    });

    socket.on("deleteAllMessages", ({ room }) => {
      io.to(room).emit("deleteAll");
    });

    socket.on("disconnect", (reason) => {
      console.log("Client disconnected: " + reason);
    });
  });
};
