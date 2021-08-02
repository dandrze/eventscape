const compression = require("compression");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const secure = require("express-force-https");
const cookieSession = require("cookie-session");
const flash = require("connect-flash");
const http = require("http");

const keys = require("./config/keys");
require("./services/passport");
require("./services/cron-scheduler")();
const terminate = require("./terminate");
const { handleError, ErrorHandler } = require("./services/error");

if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging")
  require("newrelic");

console.log(process.env.NODE_ENV);
console.log(process.env.ENV);

const logger = require("./services/winston");

const PORT = process.env.PORT || 5000;

const app = express();
/* console.log(`server process is: ${process.pid}`);
console.log(`Dyno is: ${process.env.DYNO}`);
console.log(`PM2 id is: ${process.env.pm_id}`);
console.log(`PM2 name is: ${process.env.name}`); */

// Force HTTPS
if (process.env.NODE_ENV === "production") app.use(secure);

// Compress to improve page load times
app.use(compression());

// Allow CORS from S3 bucket for testing
var corsOptions = {
  origin: [
    "http://app.localhost:3000/",
    /\.emeryhill\.com$/,
    "https://eventscape-staging.herokuapp.com/",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
});

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
app.use(require("./routes/pollingRoutes"));
app.use(require("./routes/billingRoutes"));
app.use(require("./routes/awsRoutes"));
app.use(require("./routes/adminRoutes"));

app.use(
  "/api/s3",
  require("react-s3-uploader/s3router")({
    bucket: "eventscape-assets",
    ACL: "public-read",
  })
);

// universal error handling for all database calls
app.use((err, req, res, next) => {
  console.log(err);

  logger.error(err.message);
  logger.error(err.stack);
  handleError(err, res);
});

const server = http.createServer(app);

require("./services/ChatSocket")(server);
require("./services/EventSocket")(server);

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
