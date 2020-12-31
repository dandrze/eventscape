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
      const user = await ChatUser.findOrCreate({
        where: {
          name,
        },
      });

      const chatRoom = await ChatRoom.findOrCreate({
        where: {
          event: room,
        },
      });

      console.log(user);
      socket.join(chatRoom);

      socket.emit("message", {
        user: "host",
        text: `${name}, welcome to room ${room}.`,
      });

      socket.broadcast
        .to(room)
        .emit("message", { user: "host", text: `${name} has joined!` });

      socket.on("sendMessage", ({ name, room, message }, callback) => {
        io.to(room).emit("message", { user: name, text: message });

        callback();
      });

      socket.on("setChatHidden", ({ isHidden, room }) => {
        console.log(isHidden);
        console.log(room);
        io.to(room).emit("chatHidden", isHidden);
      });

      callback();
    });

    socket.on("disconnect", (reason) => {
      console.log("Client disconnected: " + reason);
    });
  });
};
