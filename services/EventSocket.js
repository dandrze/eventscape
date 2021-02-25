var socketIo = require("socket.io");
const redisAdapter = require("socket.io-redis");

const { SiteVisit, SiteVisitor } = require("../db").models;
const keys = require("../config/keys");

module.exports = (server) => {
  const io = socketIo(server, {
    path: "/api/socket/event",
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      transports: ["websocket"],
    },
  });

  io.adapter(redisAdapter(keys.redisUrl));

  io.on("connection", (socket) => {
    socket.on(
      "join",
      async ({ EventId, uuid, attendeeId, geoData, isModerator }) => {
        // if it's the moderator, just join the room and end the function
        if (isModerator) {
          return socket.join(EventId.toString());
        }
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

        socket.join(EventId.toString());
        console.log(
          socket.id + "Joined " + EventId + " on process " + process.pid
        );
      }
    );

    socket.on("rejoin", async (eventId) => {
      console.log(
        socket.id + " rejoined " + eventId + " on process " + process.pid
      );
      socket.join(eventId.toString());
    });

    socket.on("pushPoll", async ({ eventId, question, options }) => {
      console.log("Poll pushed to " + eventId);
      io.to(eventId.toString()).emit("poll", { question, options });
    });

    socket.on("closePoll", async (eventId) => {
      console.log("Poll ended for " + eventId);
      io.to(eventId.toString()).emit("pollClosed");
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
