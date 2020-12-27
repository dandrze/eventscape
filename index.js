const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const secure = require("express-force-https");
const cookieSession = require("cookie-session");

const db = require("./db");
const keys = require("./config/keys");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const modelRoutes = require("./routes/modelRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const emailRoutes = require("./routes/emailRoutes");
require("./services/passport");

//console.log(process.env.DATABASE_URL);

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

// routes
app.use(authRoutes);
app.use(eventRoutes);
app.use(modelRoutes);
app.use(registrationRoutes);
app.use(emailRoutes);

if (process.env.NODE_ENV == "production") {
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
