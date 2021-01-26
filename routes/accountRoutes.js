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

router.post("/api/account", async (req, res, next) => {
  const { userData } = req.body;
  const { emailAddress, firstName, lastName, password } = userData;

  const hashedPassword = await bcrypt.hashSync(password, saltRounds);

  const account = await Account.create({
    emailAddress,
    firstName,
    lastName,
    password: hashedPassword,
  }).catch(next);

  res.status(200).send(account);
});

router.get("/api/account/email", async (req, res, next) => {
  const { emailAddress } = req.query;

  const account = await Account.findOne({ where: { emailAddress } }).catch(
    next
  );

  res.status(200).send(account);
});

module.exports = router;
