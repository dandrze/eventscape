const express = require("express");
const passport = require("passport");
const { sendCode } = require("../services/LoginCode");

const router = express.Router();

router.post(
  "/auth/login/local",
  /* passport.authenticate("local", {
    successRedirect: "/auth/success",
    failureRedirect: "/auth/fail",
    failureFlash: true,
  }) */
  (req, res) => {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    console.log(req.user);
  }
);

router.get("/auth/success", async (req, res) => {
  res.json({ user: req.user, error: null });
});

router.get("/auth/fail", async (req, res) => {
  const error = req.flash("error");
  res.json({ user: null, error });
});

router.get("/auth/current-user", async (req, res) => {
  if (req.user) {
    res.send(req.user);
  } else {
    res.send(null);
  }
});

router.get("/auth/logout", (req, res) => {
  const { target } = req.query;

  req.logout();
  res.redirect("/" + target);
});

router.post("/auth/send-code", async (req, res, next) => {
  try {
    const { emailAddress } = req.body;

    sendCode(emailAddress);

    res.status(200).send(true);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
