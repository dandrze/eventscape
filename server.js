const compression = require("compression");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const secure = require("express-force-https");
const session = require("express-session");
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
  origin: "https://app.emeryhill.com",
  credentials: true,
  optionsSuccessStatus: 200,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(cors(corsOptions));

// passport set up for user auth
app.use(bodyParser.json());
app.use(session({ secret: "cats", cookie: { httpOnly: false, secure: true } }));

app.set("trust proxy", 1); // trust first proxy

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
