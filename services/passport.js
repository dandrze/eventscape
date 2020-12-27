const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../db");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = db.query("SELECT * FROM user WHERE id=$1", [id]).rows[0];

  done(null, user);
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    console.log(username, password);
    console.log("strategy called");

    const user = await db.query("SELECT * FROM user");

    console.log(user.rows);

    //return done(null, user);
  })
);
