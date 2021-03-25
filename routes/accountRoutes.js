const express = require("express");
const bcrypt = require("bcrypt");

const { Account } = require("../db").models;
const { clearCache } = require("../services/sequelizeRedis");

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
  clearCache(`Account:id:${account.id}`);

  res.status(200).send(account);
});

router.post("/api/account", async (req, res, next) => {
  const { userData } = req.body;
  const { emailAddress, firstName, lastName, password } = userData;

  const hashedPassword = await bcrypt.hashSync(password, saltRounds);

  let account;

  try {
    // check to see if there is an unregistered account
    // an unregistered account happens when a user adds an email address as a collaborator but that user hasn't created an account yet
    const unregisteredAccount = await Account.findOne({
      where: { emailAddress: emailAddress.toLowerCase() },
    });
    if (unregisteredAccount) {
      unregisteredAccount.firstName = firstName;
      unregisteredAccount.lastName = lastName;
      unregisteredAccount.password = hashedPassword;
      unregisteredAccount.registrationComplete = true;
      await unregisteredAccount.save();
      account = unregisteredAccount;
    } else {
      account = await Account.create({
        emailAddress: emailAddress.toLowerCase(),
        firstName,
        lastName,
        password: hashedPassword,
        registrationComplete: true,
      });
    }

    clearCache(`Account:id:${account.id}`);

    res.status(200).send(account);
  } catch (error) {
    next(error);
  }
});

router.get("/api/account/email", async (req, res, next) => {
  const { emailAddress } = req.query;

  try {
    const account = await Account.findOne({
      where: { emailAddress, registrationComplete: true },
    });

    res.status(200).send(account);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
