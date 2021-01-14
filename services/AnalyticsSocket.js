var socketIo = require("socket.io");
const { SiteVisit } = require("../sequelize").models;

module.exports = (server) => {
  const io = socketIo(server, {
    path: "/api/socket/analytics",
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("join", async ({ eventId, uuid }) => {
      const siteVisit = await SiteVisit.create({
        eventId,
        uniqueVisitorId: uuid,
      });
      socket.visitId = siteVisit.id;
    });

    socket.on("disconnect", async (reason) => {
      const siteVisit = await SiteVisit.findByPk(socket.visitId);

      if (siteVisit) {
        siteVisit.loggedOutAt = new Date();
        siteVisit.save();
      }
    });
  });
};
