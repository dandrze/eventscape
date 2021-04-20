const express = require("express");
const bcrypt = require("bcrypt");

const { Account } = require("../db").models;
const { clearCache } = require("../services/sequelizeRedis");
const requireAuth = require("../middlewares/requireAuth");
const { scheduleJob } = require("../services/Scheduler");
const { sendEmail } = require("../services/Mailer");

const saltRounds = 10;

const router = express.Router();

router.put("/api/account", requireAuth, async (req, res) => {
  const { userId, contactData } = req.body;
  const { firstName, lastName, emailAddress } = contactData;

  const account = await Account.findByPk(userId);
  account.firstName = firstName;
  account.lastName = lastName;
  account.emailAddress = emailAddress;
  account.save();
  clearCache(`Account:id:${account.id}`);

  res.json(account);
});

// public endpoint
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

    var welcomeSendDate = new Date();
    welcomeSendDate.setMinutes(welcomeSendDate.getMinutes() + 27);

    scheduleJob(`${account.id} welcome`, welcomeSendDate, () =>
      sendEmail(
        {
          to: account.emailAddress,
          subject: "Thank you for choosing Eventscape",
          html: `<p>Hi ${account.firstName},</p>

          <p>Thank you for choosing Eventscape for your event! </p>
          
          <p>My name is David and I am the co-founder of Eventscape. I wanted to formally introduce myself as I will be your primary point of contact as you build and launch your event.</p> 
          
          <p>May I ask what brought you to our app? I will ensure you have everything you need to accomplish your goal. </p>
          
          <p>Kind regards,</p>
          
          <p>David Andrzejewski</p>
          <p>Co-Founder</p>
          <p>Eventscape</p>`,
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

module.exports = router;
