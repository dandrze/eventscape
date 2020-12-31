var socketIo = require("socket.io");

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

    socket.on("join", ({ name, room }, callback) => {
      socket.join(room);

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

      callback();
    });

    socket.on("disconnect", (reason) => {
      console.log("Client disconnected: " + reason);
    });
  });
};
