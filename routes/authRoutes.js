const express = require("express");
const passport = require("passport");
const { sendCode } = require("../services/LoginCode");
const { Account } = require("../db").models;
const { clearCache } = require("../services/sequelizeRedis");

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
  console.log(JSON.stringify(req.headers));

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
