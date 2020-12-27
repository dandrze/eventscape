const express = require("express");
const passport = require("passport");

const router = express.Router();

router.post(
  "/auth/login/local",
  passport.authenticate("local", {
    successRedirect: "/auth/success",
    failureRedirect: "/auth/fail",
    failureFlash: true,
  })
);

router.get("/auth/success", async (req, res) => {
  res.json({ user: req.user, error: null });
});

router.get("/auth/fail", async (req, res) => {
  const error = req.flash("error");
  res.json({ user: null, error });
});

router.get("/auth/current-user", async (req, res) => {
  console.log(req.user);
  res.send(req.user);
});

router.get("/auth/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = router;
