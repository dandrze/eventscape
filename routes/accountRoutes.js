const express = require("express");
const bcrypt = require("bcrypt");
const { Account } = require("../db").models;

const saltRounds = 10;

const router = express.Router();

router.put("/api/account", async (req, res) => {
  const { userId, contactData } = req.body;
  const { firstName, lastName, emailAddress } = contactData;

  const account = await Account.findByPk(userId);
  account.firstName = firstName;
  account.lastName = lastName;
  account.emailAddress = emailAddress;
  account.save();

  res.status(200).send(account);
});

router.post("/api/account", async (req, res) => {
  const { userData } = req.body;
  const { emailAddress, firstName, lastName, password } = userData;

  const hashedPassword = await bcrypt.hashSync(password, saltRounds);

  const account = await Account.create({
    emailAddress,
    firstName,
    lastName,
    password: hashedPassword,
  });

  res.status(200).send(account);
});

router.get("/api/account/email", async (req, res) => {
  const { emailAddress } = req.query;

  const account = await Account.findOne({ where: { emailAddress } });

  res.status(200).send(account);
});

router.put("/api/account/pw", async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  const account = await Account.findByPk(userId);

  // if the password doesn't match, return an 401 unauthorized error
  const match = await bcrypt.compare(oldPassword, account.password);
  if (!match) {
    return res.status(401).send({ error: "Current password is not correct" });
  }

  // has the password so we don't store the plain text password in our database
  const hashedPassword = await bcrypt.hashSync(newPassword, saltRounds);

  account.password = hashedPassword;
  account.save();

  res.status(200).send(account);
});

module.exports = router;
