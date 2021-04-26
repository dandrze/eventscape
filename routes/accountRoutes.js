const express = require("express");
const bcrypt = require("bcrypt");

const { Account } = require("../db").models;
const { clearCache } = require("../services/sequelizeRedis");
const requireAuth = require("../middlewares/requireAuth");
const { scheduleJob } = require("../services/Scheduler");
const { sendEmail } = require("../services/Mailer");
const { sendCode } = require("../services/LoginCode");

const saltRounds = 10;

const jwt = require("jwt-simple");
const keys = require("../config/keys");

const router = express.Router();

router.put("/api/account", requireAuth, async (req, res) => {
  const { userId, contactData } = req.body;
  const { firstName, lastName, emailAddress } = contactData;

  const account = await Account.findByPk(userId);
  account.firstName = firstName;
  account.emailAddress = emailAddress;
  account.save();
  clearCache(`Account:id:${account.id}`);

  res.json(account);
});

// public endpoint
router.post("/api/account", async (req, res, next) => {
  const { userData } = req.body;
  const { emailAddress, firstName } = userData;

  let account;

  try {
    // check to see if there is an unregistered account
    // an unregistered account happens when a user adds an email address as a collaborator but that user hasn't created an account yet
    const unregisteredAccount = await Account.findOne({
      where: { emailAddress: emailAddress.toLowerCase() },
    });
    if (unregisteredAccount) {
      unregisteredAccount.firstName = firstName;
      unregisteredAccount.registrationComplete = true;
      await unregisteredAccount.save();
      account = unregisteredAccount;
    } else {
      account = await Account.create({
        emailAddress: emailAddress.toLowerCase(),
        firstName,
        registrationComplete: true,
      });
    }

    clearCache(`Account:id:${account.id}`);

    // send a login code for the next step
    sendCode(account.emailAddress);

    // send welcome email

    var welcomeSendDate = new Date();
    welcomeSendDate.setMinutes(welcomeSendDate.getMinutes() + 27);

    scheduleJob(`${account.id} welcome`, welcomeSendDate, () =>
      sendEmail(
        {
          to: account.emailAddress,
          subject: "Your Event Support Manager",
          html: `<p>Hello!</p>

          <p>Thank you for choosing Eventscape for your event! </p>
          
          <p>My name is David and I am your Event Support Manager. I will be your primary point of contact as you build and launch your event.</p> 
          
          <p>May I ask what type of event are you looking to create? I will ensure you have everything you need to accomplish your goal. </p>
          
          <p>Kind regards,</p>
          
          <p>David Andrzejewski</p>
          <p>Event Support Manager</p>
          <p>Eventscape</p>`,
          useTemplate: true,
        },
        {
          email: "david.andrzejewski@eventscape.io",
          name: "David Andrzejewski",
        }
      )
    );

    res.json(account);
  } catch (error) {
    next(error);
  }
});

// public endpoint
router.get("/api/account/email-exists", async (req, res, next) => {
  const { emailAddress } = req.query;

  try {
    const account = await Account.findOne({
      where: { emailAddress, registrationComplete: true },
    });

    res.json(Boolean(account));
  } catch (error) {
    next(error);
  }
});

router.post("/api/account/tour-complete", async (req, res, next) => {
  try {
    const userId = req.user.id;

    const account = await Account.findByPk(userId);

    account.tourComplete = true;
    await account.save();

    res.send(true);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
