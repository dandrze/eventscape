// keys.js - figure out what set of credentials to return
if (process.env.NODE_ENV === "development") {
  module.exports = require("./dev");
} else {
  module.exports = require("./prod");
}

// make sure you have a dev.js file in your local config folder. Copy paste this code into it:
/*
module.exports = {
    sendGridKey: COPY THE SENDGRID KEY HERE,
  };
  
  */
