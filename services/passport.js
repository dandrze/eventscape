const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;
const { Account, AccountCached } = require("../db").models;

const saltRounds = 10;

// this is called after the strategy is complete and when done(null, user) is called
// it takes the user and then serializes it and puts it into a cookie in the users browser for future server calls
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  //const cacheKey = `Account:id:${id}`;
  //const [user, cacheHit] = await AccountCached.findByPkCached(cacheKey, id);
  const user = await Account.findByPk(id);

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

    if (!user.registrationComplete) {
      return done(null, false, {
        message: "Please create an account to complete your registration",
      });
    }

    const codeExpired = new Date() > new Date(user.loginCodeExpiration);

    console.log({
      codeExpired,
      password,
      code: user.loginCode,
      codeDate: new Date(user.loginCodeExpiration),
      currentDate: new Date(),
    });

    if (password.toString() === user.loginCode.toString() && !codeExpired) {
      console.log(user);
      return done(null, user);
    } else {
      return done(null, false, {
        message: "Code is invalid or expired. Please request a new one.",
      });
    }
  })
);
