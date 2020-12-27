const express = require("express");
const passport = require("passport");

const router = express.Router();

router.post("/auth/login/local", passport.authenticate("local"), (req, res) => {
  console.log(req.user);
  // make sure to respond to the request
  res.send(req.user);
  //res.redirect("/design");
});

router.get("/auth/current-user", async (req, res) => {
  console.log(req.user);
  res.send(req.user);
});

module.exports = router;
