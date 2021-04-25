const express = require("express");
const passport = require("passport");
const jwt = require("jwt-simple");
const bcrypt = require("bcrypt");

const keys = require("../config/keys");
const { sendEmail } = require("../services/Mailer");
const { Account } = require("../db").models;
const { clearCache } = require("../services/sequelizeRedis");

const router = express.Router();
const saltRounds = 10;

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
  if (req.user) {
    // retrieve all values except for password
    const { password, ...user } = req.user.dataValues;

    res.send(user);
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
