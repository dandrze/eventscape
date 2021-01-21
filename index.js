const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const secure = require("express-force-https");
const cookieSession = require("cookie-session");
const flash = require("connect-flash");
const http = require("http");

const db = require("./db");
const keys = require("./config/keys");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const modelRoutes = require("./routes/modelRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const communicationRoutes = require("./routes/communicationRoutes");
const accountRoutes = require("./routes/accountRoutes");
const liveEventRoutes = require("./routes/liveEventRoutes");
const chatRoomRoutes = require("./routes/chatRoomRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
require("./services/passport");

const app = express();

// Force HTTPS
app.use(secure);

// passport set up for user auth
app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// routes
app.use(authRoutes);
app.use(eventRoutes);
app.use(modelRoutes);
app.use(registrationRoutes);
app.use(communicationRoutes);
app.use(accountRoutes);
app.use(liveEventRoutes);
app.use(chatRoomRoutes);
app.use(analyticsRoutes);
// universal error handling for all database calls with .catch(next) at the end
app.use((error, req, res, next) => {
  // console log will be replaced with logging when implemented
  console.log("ERROR: " + error.toString());
  return res.status(500).json({ error: error.toString() });
});

if (process.env.NODE_ENV == "production") {
  // safely crash if there is an uncaught exception
  process.on("uncaughtException", (err) => {
    console.log(`Uncaught Exception: ${err.message}`);
    process.exit(1);
  });

  // safely crash if there is an unhandled rejection
  process.on("unhandledRejection", (reason, promise) => {
    console.log("Unhandled rejection at ", promise, `reason: ${err.message}`);
    process.exit(1);
  });

  // if we don't recognize the route, look into the client/build folder
  // will catch things like main.js and main.css
  app.use(express.static("client/build"));

  // if there is no route in the client/build folder then:
  // if we don't regonize the route, serve the html document
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const server = http.createServer(app);

require("./services/ChatSocket")(server);
require("./services/AnalyticsSocket")(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
