const passport = require("passport");
const bcrypt = require("bcrypt");

const LocalStrategy = require("passport-local").Strategy;
const { Account } = require("../db").models;

const saltRounds = 10;

// this is called after the strategy is complete and when done(null, user) is called
// it takes the user and then serializes it and puts it into a cookie in the users browser for future server calls
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await Account.findByPk(id);

  done(null, user);
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    console.log(username, password);
    console.log("strategy called");

    const user = await Account.findOne({
      where: { emailAddress: username.toLowerCase() },
    });

    if (!user) {
      console.log("user not found");
      return done(null, false, { message: "Incorrect username." });
    }

    // compare the password against the hashed password stored in postgres
    console.log({ password, oldpw: user.password });
    const match = await bcrypt.compare(password, user.password);
    console.log(match);

    if (match) {
      return done(null, user);
    } else {
      console.log("incorrect password");
      return done(null, false, { message: "Incorrect password." });
    }
  })
);
