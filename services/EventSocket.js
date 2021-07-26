var socketIo = require("socket.io");
const redisAdapter = require("./socketioRedisAdapter");

const { SiteVisit, SiteVisitor, PollResponse, Poll, PollOption } =
  require("../db").models;

module.exports = (server) => {
  const io = socketIo(server, {
    path: "/api/socket/event",
    cors: {
      origin: ["http://test1.localhost:3000/", "http://app.localhost:3000/"],
      methods: ["GET", "POST"],
      credentials: true,
      transports: ["websocket", "polling"],
    },

    upgrade: true,
    pingTimeout: 30000,
    allowEIO3: true,
  });

  // Redis adapter for multi server
  io.adapter(redisAdapter);

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

        const [siteVisit] = await SiteVisit.findOrCreate({
          where: {
            EventId,
            SiteVisitorId: siteVisitor.id,
            loggedOutAt: null,
          },
        });
        socket.visitId = siteVisit.id;
        socket.visitorId = siteVisitor.id;

        socket.join(EventId.toString());
      }
    );

    socket.on("rejoin", async ({ eventId, uuid }) => {
      if (uuid) {
        try {
          const siteVisitor = await SiteVisitor.findOne({ where: { uuid } });
          if (siteVisitor) {
            const siteVisit = await SiteVisit.findOne({
              where: { SiteVisitorId: siteVisitor.id },
            });
            if (siteVisit) {
              socket.visitId = siteVisit.id;
              socket.visitorId = siteVisitor.id;
            }
          }
        } catch {
          console.log("Site visitor doesn't exist");
        }
      }
      socket.join(eventId.toString());
    });

    socket.on(
      "pushPoll",
      async ({ eventId, question, options, allowMultiple }) => {
        io.to(eventId.toString()).emit("poll", {
          question,
          options,
          allowMultiple,
        });
      }
    );

    socket.on("closePoll", async (eventId) => {
      io.to(eventId.toString()).emit("pollClosed");
    });

    socket.on("respondToPoll", async (selectedOptions) => {
      for (let option of selectedOptions) {
        PollResponse.create({
          PollOptionId: option.id,
          SiteVisitorId: socket.visitorId,
        }).catch(function (err) {
          // #TODO add logging
          console.log(err);
        });
      }
    });

    socket.on(
      "sharePollResults",
      async ({ eventId, poll, results, totalResponded }) => {
        console.log({ eventId, poll, results, totalResponded });
        io.to(eventId.toString()).emit("results", {
          question: poll.question,
          results,
          allowMultiple: poll.allowMultiple,
        });
      }
    );

    socket.on("stopSharingPollResults", async (eventId) => {
      io.to(eventId.toString()).emit("closeResults");
    });

    socket.on("pushRefreshPage", async (eventId, callback) => {
      // count how many active users are on this event page
      const count = await SiteVisit.count({
        where: { EventId: eventId, loggedOutAt: null },
      });

      // emit an event to refresh the page. Delay the refresh randomly between 0 and the duration to spread the requests out
      io.to(eventId.toString()).emit("refreshPage", {
        duration: count * 30,
      });

      // return the duration to the admin client for notification purposes
      callback({
        duration: count * 30,
      });
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
