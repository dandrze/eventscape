const passport = require("passport");
const bcrypt = require("bcrypt");

const LocalStrategy = require("passport-local").Strategy;
const { Account, AccountCached } = require("../db").models;

const saltRounds = 10;

// this is called after the strategy is complete and when done(null, user) is called
// it takes the user and then serializes it and puts it into a cookie in the users browser for future server calls
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const cacheKey = `Account:id:${id}`;
  const [user, cacheHit] = await AccountCached.findByPkCached(cacheKey, id);

  if (cacheHit) console.log("Cache Hit: " + cacheKey);

  done(null, user);
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await Account.findOne({
      where: { emailAddress: username.toLowerCase() },
    });

    if (!user) {
      return done(null, false, { message: "Incorrect username." });
    }

    // compare the password against the hashed password stored in postgres
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      return done(null, user);
    } else {
      return done(null, false, { message: "Incorrect password." });
    }
  })
);
