var socketIo = require("socket.io");
const { SiteVisit, SiteVisitor } = require("../db").models;

module.exports = (server) => {
  const io = socketIo(server, {
    path: "/api/socket/analytics",
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("join", async ({ EventId, uuid, attendeeId }) => {
      const [siteVisitor, created] = await SiteVisitor.findOrCreate({
        where: {
          uuid,
          RegistrationId: attendeeId,
          EventId,
        },
      });

      const siteVisit = await SiteVisit.create({
        EventId,
        SiteVisitorId: siteVisitor.id,
      });
      socket.visitId = siteVisit.id;
    });

    socket.on("disconnect", async (reason) => {
      const siteVisit = await SiteVisit.findByPk(socket.visitId, {
        include: SiteVisitor,
      });

      if (siteVisit) {
        siteVisit.loggedOutAt = new Date();
        siteVisit.SiteVisitor.loggedOutAt = siteVisit.loggedOutAt;
        siteVisit.save();
        siteVisit.SiteVisitor.save();
      }
    });
  });
};
