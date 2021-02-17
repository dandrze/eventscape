var socketIo = require("socket.io");
const { SiteVisit, SiteVisitor } = require("../db").models;

module.exports = (server) => {
  const io = socketIo(server, {
    path: "/api/socket/analytics",
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      transports: ["websocket"],
    },
  });

  
  io.on("connection", (socket) => {
    socket.on("join", async ({ EventId, uuid, attendeeId, geoData }) => {
      const [siteVisitor, created] = await SiteVisitor.findOrCreate({
        where: {
          uuid,
          RegistrationId: attendeeId || null,
          EventId,
        },
      });

      // Save geo data
      siteVisitor.city = geoData.city;
      siteVisitor.country = geoData.country;
      siteVisitor.countryCode = geoData.countryCode;
      siteVisitor.lat = geoData.lat;
      siteVisitor.long = geoData.long;
      await siteVisitor.save();

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
        siteVisit.save();
        siteVisit.SiteVisitor.save();
      }
    });
  });
  
};
