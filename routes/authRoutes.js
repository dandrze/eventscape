const express = require("express");
const passport = require("passport");

const router = express.Router();

router.post(
  "/auth/login/local",
  passport.authenticate("local", {
    successRedirect: "/design",
    failureRedirect: "/create-account",
    failureFlash: true,
  })
);

router.post("/success", async (req, res) => {
  console.log("/success route");
  res.send("success");
});

module.exports = router;
