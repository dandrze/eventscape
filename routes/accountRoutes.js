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

    // send confirmation link
    // create a hash with the users account id. Only need 1 salt round as it doesn't need to be secure
    const payload = { userId: account.id };
    const secret = keys.jwtSecretKey;
    const verifyToken = jwt.encode(payload, secret);

    sendEmail(
      {
        to: account.emailAddress,
        subject: "Eventscape - Confirm Your Email Address",
        html: `<p>Hello ${account.firstName}</p>
    <p>Please confirm your email address to activate your account.</p>
    <div contenteditable="false" style="text-align: left;"><a href="https://app.eventscape.io/account/confirmation/${verifyToken}"><button style="
					font-family: Helvetica, Arial, sans-serif;
					font-weight: bold;
					font-size: 20;
					color: white;
					background-color: #b0281c;
					padding: 16px;
          cursor: pointer;
					border-width: 2px;
					border-radius: 6px;
					border-color: #b0281c;
					border-style: solid;
					height: min-content;
					text-align: left;">Join Now</button></a></div>
    <p>You may also use this link: https://app.eventscape.io/account/confirmation/${verifyToken} </p>`,
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
          subject: "Thank you for choosing Eventscape",
          html: `<p>Hi ${account.firstName},</p>

          <p>Thank you for choosing Eventscape for your event! </p>
          
          <p>My name is David and I am the co-founder of Eventscape. I wanted to formally introduce myself as I will be your primary point of contact as you build and launch your event.</p> 
          
          <p>May I ask what brought you to our app? I will ensure you have everything you need to accomplish your goal. </p>
          
          <p>Kind regards,</p>
          
          <p>David Andrzejewski</p>
          <p>Co-Founder</p>
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

router.post("/api/account/verify-email", async (req, res, next) => {
  try {
    const { token } = req.body;

    const { userId } = jwt.decode(token, keys.jwtSecretKey);

    const account = await Account.findByPk(userId);
    account.emailVerified = true;
    await account.save();

    res.send(true);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
