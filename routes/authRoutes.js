const express = require("express");
const passport = require("passport");
const jwt = require("jwt-simple");
const bcrypt = require("bcrypt");

const keys = require("../config/keys");
const { sendEmail } = require("../services/Mailer");
const { Account } = require("../db").models;

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
    const { firstName, lastName, emailAddress, id } = req.user;
    res.send({ firstName, lastName, emailAddress, id });
  } else {
    res.send(null);
  }
});

router.get("/auth/logout", (req, res) => {
  const { target } = req.query;

  req.logout();
  res.redirect("/" + target);
});

router.post("/auth/request-password-reset", async (req, res, next) => {
  const { emailAddress } = req.body;

  try {
    const account = await Account.findOne({
      where: {
        emailAddress: emailAddress.toLowerCase(),
      },
    });
    if (account) {
      const expiration = new Date();
      expiration.setMinutes(expiration.getMinutes() + 30);

      const payload = { userId: account.id, expiration };
      const secret = keys.jwtSecretKey;
      const token = jwt.encode(payload, secret);

      const html = `
      <h1>Create a new password</h1>
      <p>You are receiving this email because you have requested to reset your password. Click the button below to get started. For your security, this request will expire in 30 minutes. Choose a password that is unique to this account and hard to guess.</p>
  
      <p>If you did not request a new password and feel you have received this email in error, please <a href = "mailto:support@eventscape.io?subject=Unexpected Password Reset">
      contact us
      </a> immediately.</p>
  
      <a href="https://app.eventscape.io/change-password/${token}">Create New Password</a>
      `;

      sendEmail({
        to: account.emailAddress,
        subject: "Create a new password",
        html,
      });

      return res.status(200).send(true);
    } else {
      return res.status(200).send(false);
    }
  } catch (error) {
    next(error);
  }
});

router.get("/auth/validate-token/:token", (req, res) => {
  const { token } = req.params;

  try {
    const payload = jwt.decode(token, keys.jwtSecretKey);
    console.log(payload);

    const { userId, expiration } = payload;

    if (new Date(expiration) < new Date()) {
      console.log(new Date(expiration).toLocaleString());
      console.log(new Date().toLocaleString());
      return res.status(400).json({ message: "expired" });
    }
    return res.status(200).json({ isValid: true });
  } catch {
    return res.status(400).json({ message: "invalid" });
  }
});

router.post("/auth/change-password-with-token", async (req, res, next) => {
  const { newPassword, token } = req.body;

  try {
    const payload = jwt.decode(token, keys.jwtSecretKey);
    const { userId, expiration } = payload;

    if (new Date(expiration) < new Date()) {
      console.log(new Date(expiration));
      console.log(new Date());
      return res.status(500).json({ message: "Password reset link expired" });
    }

    const account = await Account.findByPk(userId);
    account.password = await bcrypt.hashSync(newPassword, saltRounds);
    await account.save();
    clearCache(`Account:${account.id}:pk`);

    return res.status(200).send(true);
  } catch {
    return res.status(400).json({ message: "Invalid password reset link" });
  }
});

router.put("/auth/change-password", async (req, res, next) => {
  const { userId, oldPassword, newPassword } = req.body;

  try {
    const account = await Account.findByPk(userId);

    // if the password doesn't match, return an 401 unauthorized error
    const match = await bcrypt.compare(oldPassword, account.password);
    if (!match) {
      return res
        .status(401)
        .json({ message: "Current password is not correct" });
    }

    // has the password so we don't store the plain text password in our database
    const hashedPassword = await bcrypt.hashSync(newPassword, saltRounds);

    account.password = hashedPassword;
    account.save();
    clearCache(`Account:id:${account.id}`);

    res.status(200).send(account);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
