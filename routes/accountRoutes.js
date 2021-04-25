const express = require("express");
const bcrypt = require("bcrypt");

const { Account } = require("../db").models;
const { clearCache } = require("../services/sequelizeRedis");
const requireAuth = require("../middlewares/requireAuth");
const { scheduleJob } = require("../services/Scheduler");
const { sendEmail } = require("../services/Mailer");

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

  // Create a 6 digit login code that expires in 15 minutes
  const loginCode = Math.floor(100000 + Math.random() * 900000);
  const loginCodeExpiration = new Date();
  loginCodeExpiration.setMinutes(loginCodeExpiration.getMinutes() + 15);

  try {
    // check to see if there is an unregistered account
    // an unregistered account happens when a user adds an email address as a collaborator but that user hasn't created an account yet
    const unregisteredAccount = await Account.findOne({
      where: { emailAddress: emailAddress.toLowerCase() },
    });
    if (unregisteredAccount) {
      unregisteredAccount.firstName = firstName;
      unregisteredAccount.registrationComplete = true;
      unregisteredAccount.loginCode = loginCode;
      unregisteredAccount.loginCodeExpiration = loginCodeExpiration;
      await unregisteredAccount.save();
      account = unregisteredAccount;
    } else {
      account = await Account.create({
        emailAddress: emailAddress.toLowerCase(),
        firstName,
        registrationComplete: true,
        loginCode,
        loginCodeExpiration,
      });
    }

    clearCache(`Account:id:${account.id}`);

    // send confirmation link
    // create a hash with the users account id. Only need 1 salt round as it doesn't need to be secure

    sendEmail(
      {
        to: account.emailAddress,
        subject: "Eventscape Login Code",
        html: `<p>Hello!</p>
    <p>here is your login code for Eventscape:</p>
    <p>${loginCode}</p>
    <p>This code expires after 15 minutes</p>
    <p>If you did not request a login from EventScape, please ignore this email. </p>`,
        useTemplate: true,
      },
      { email: "notifications@eventscape.io", name: "Eventscape" }
    );

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
