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

passport.authenticate();

router.get("/auth/success", async (req, res) => {
  res.json({ user: req.user, error: null });
});

router.get("/auth/fail", async (req, res) => {
  const error = req.flash("error");
  res.json({ user: null, error });
});

router.get("/auth/current-user", async (req, res) => {
  if (req.user) {
    const { firstName, lastName, email, id } = req.user;
    res.send({ firstName, lastName, email, id });
  } else {
    res.send(null);
  }
});

router.get("/auth/logout", (req, res) => {
  const { target } = req.query;

  req.logout();
  res.redirect("/" + target);
});

module.exports = router;
