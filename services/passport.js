const passport = require("passport");
const bcrypt = require("bcrypt");

const LocalStrategy = require("passport-local").Strategy;
const db = require("../db");

const saltRounds = 10;

// this is called after the strategy is complete and when done(null, user) is called
// it takes the user and then serializes it and puts it into a cookie in the users browser for future server calls
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const response = await db.query("SELECT * FROM user_account WHERE id=$1", [
    id,
  ]);

  const user = response.rows[0];

  done(null, user);
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    console.log(username, password);
    console.log("strategy called");

    const response = await db.query(
      "SELECT * FROM user_account WHERE email = $1",
      [username]
    );

    const user = response.rows[0];

    if (!user) {
      console.log("user not found");
      return done(null, false, { message: "Incorrect username." });
    }

    // compare the password against the hashed password stored in postgres
    const match = bcrypt.compare(password, user.password);

    if (!match) {
      console.log("incorrect password");
      return done(null, false, { message: "Incorrect password." });
    }

    return done(null, user);
  })
);
