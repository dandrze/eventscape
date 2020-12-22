// keys.js - figure out what set of credentials to return
if (process.env.NODE_ENV === "production") {
  // return the prod set of keys
  module.exports = require("./prod");
} else {
  // return dev keys/
  module.exports = require("./dev");
}

// make sure you have a dev.js file in your local config folder. Copy paste this code into it:
/*
module.exports = {
    sendGridKey: COPY THE SENDGRID KEY HERE,
  };
  
  */
