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
          // attendeeId (could be null if it's a visitor. Otherwise it points to an attendee)
        },
      });
      console.log(attendeeId);

      const siteVisit = await SiteVisit.create({
        EventId,
        SiteVisitorId: siteVisitor.id,
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
