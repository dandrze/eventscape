const throng = require("throng");
if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging")
  require("newrelic");

//const WORKERS = process.env.WEB_CONCURRENCY || 1;
const WORKERS = 2;
const PORT = process.env.PORT || 5000;

throng({
  workers: WORKERS,
  lifetime: Infinity,
  worker: start,
});

function start() {
  const compression = require("compression");
  const express = require("express");
  const bodyParser = require("body-parser");
  const passport = require("passport");
  const secure = require("express-force-https");
  const cookieSession = require("cookie-session");
  const flash = require("connect-flash");
  const http = require("http");
  const keys = require("./config/keys");
  require("./services/passport");
  const terminate = require("./terminate");
  const { handleError, ErrorHandler } = require("./services/error");

  const logger = require("./services/winston");

  const app = express();
  console.log(`server process is: ${process.pid}`);

  // Force HTTPS
  if (process.env.NODE_ENV === "production") app.use(secure);

  // Compress to improve page load times
  app.use(compression());

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
  app.use(require("./routes/authRoutes"));
  app.use(require("./routes/eventRoutes"));
  app.use(require("./routes/modelRoutes"));
  app.use(require("./routes/registrationRoutes"));
  app.use(require("./routes/communicationRoutes"));
  app.use(require("./routes/accountRoutes"));
  app.use(require("./routes/liveEventRoutes"));
  app.use(require("./routes/chatRoomRoutes"));
  app.use(require("./routes/analyticsRoutes"));
  app.use(require("./routes/froalaRoutes"));
  app.use(require("./routes/testRoutes"));

  app.get("/loaderio-feb5ca360d9f5cdf226bcd9fb3240326", async (req, res) => {
    file = `${__dirname}/public/loaderio-verification.txt`;

    res.download(file);
  });

  // universal error handling for all database calls
  app.use((err, req, res, next) => {
    logger.error(err.message);
    logger.error(err.stack);
    handleError(err, res);
  });

  if (process.env.NODE_ENV != "development") {
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

  const exitHandler = terminate(server, {
    coredump: false,
    timeout: 500,
  });
  // safely crash if there is an uncaught exception
  process.on("uncaughtException", exitHandler(1, "Unexpected Error"));
  process.on("unhandledRejection", exitHandler(1, "Unhandled Promise"));
  process.on("SIGTERM", exitHandler(0, "SIGTERM"));
  process.on("SIGINT", exitHandler(0, "SIGINT"));

  server.listen(PORT, () => {
    console.log("listening on port " + PORT);
  });
}
