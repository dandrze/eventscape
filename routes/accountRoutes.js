const express = require("express");

const { Account, Event } = require("../db").models;
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
  const { firstName, emailAddress } = contactData;

  const account = await Account.findByPk(userId);
  account.firstName = firstName;
  account.emailAddress = emailAddress;
  account.save();
  clearCache(`Account:id:${account.id}`);

  res.json(account);
});

// public endpoint
router.post("/api/account", async (req, res, next) => {
  const { userData, isMobile } = req.body;
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
        emailAddress,
        firstName,
        registrationComplete: true,
        createdOnMobile: isMobile,
      });
    }

    clearCache(`Account:id:${account.id}`);

    // send a login code for the next step
    sendCode(account.emailAddress);

    // send welcome email

    var welcomeSendDate = new Date();
    welcomeSendDate.setHours(welcomeSendDate.getHours() + 2);

    // Schedule welcome email 2 hours after account creation
    scheduleJob(`${account.id} welcome`, welcomeSendDate, () =>
      sendEmail(
        {
          to: account.emailAddress,
          subject: "Welcome to Eventscape",
          html: `<p>Hi ${account.firstName},</p>

          <p>Welcome to Eventscape!</p>
          
          <p>My name is David and I want to formally introduce myself, I am the Head of Product and will be your primary point of contact as you build and launch your event. It's my job to ensure you have everything you need for a successful event.</p> 
          
          <p>May I ask what type of event are you looking to create? I will ensure you have everything you need to accomplish your goal. </p>
          
          <p>I would love to schedule a call to chat about your event. </p>

          <p>Looking forward to hearing from you!</p>

          <p>Kind regards,</p>
          
          <strong>David Andrzejewski | Head of Product</strong>
          <p>PH4 - 73 Richmond Street West</p>
          <p>Toronto, Ontario, Canada, M5V 1V6</p>
          <p>+1 (912) 403-9854</p>
          <a href="https://www.eventscape.io">Eventscape.io</a>`,
        },
        {
          email: "david.andrzejewski@eventscape.io",
          name: "David Andrzejewski",
        }
      )
    );

    // schedule 1 hour reminder if a user hasn't created their event yet
    var oneHourSendDate = new Date();
    oneHourSendDate.setHours(oneHourSendDate.getHours() + 1);

    scheduleJob(`${account.id} 1 hour`, oneHourSendDate, async () => {
      const event = await Event.findOne({ where: { OwnerId: account.id } });

      if (!event) {
        sendEmail(
          {
            to: account.emailAddress,
            subject: "Finish creating your livestream event",
            html: `<p>Hi ${account.firstName},</p>

          <p>Seems you didn’t finish creating your event with Eventscape!</p>
          
          <p>No worries, here’s a quick link so you can finish setting up when you’re ready.</p> 

          <div contenteditable="false" style="text-align: left;"><a href="https://app.eventscape.io/create-event"><button style="
					font-family: Helvetica, Arial, sans-serif;
					font-weight: 500;
          font-size: 1em;
					color: white;
					background-color: #b0281c;
					padding: 8px;
					border-width: 2px;
					border-radius: 6px;
					border-color: #b0281c;
					border-style: solid;
					height: min-content;
					text-align: left;">Finish Setting Up Your Event</button></a></div>
            <br/>
          <p>The Eventscape Team</p>`,
          },
          {
            email: "notifications@eventscape.io",
            name: "Eventscape",
          }
        );
      }
    });

    // follow up email 2 days later. One version if they created event, and another version if they didn't.
    var twoDaySendDate = new Date();
    twoDaySendDate.setHours(twoDaySendDate.getHours() + 48);

    scheduleJob(`${account.id} 2 day`, twoDaySendDate, async () => {
      const event = await Event.findOne({ where: { OwnerId: account.id } });

      if (event) {
        sendEmail(
          {
            to: account.emailAddress,
            subject: "Your Livestream Event",
            html: `<p>Hi ${account.firstName},</p>

          <p>Thank you for your interest in Eventscape! I saw you have done some platform exploring and set up an event. I hope you found it easy to navigate.</p>
          
          <p>I'd love to know more about your needs and how we can assist further. Do you have a few minutes to chat about your event? If so, just let me know a time that works well for you. </p> 

          <p>Kind regards,</p>
          
          <strong>David Andrzejewski | Head of Product</strong>
          <p>PH4 - 73 Richmond Street West</p>
          <p>Toronto, Ontario, Canada, M5V 1V6</p>
          <p>+1 (912) 403-9854</p>
          <a href="https://www.eventscape.io">Eventscape.io</a>`,
          },
          {
            email: "david.andrzejewski@eventscape.io",
            name: "David Andrzejewski",
          }
        );
      } else {
        sendEmail(
          {
            to: account.emailAddress,
            subject: "Create Your Livestream Event",
            html: `<p>Hi ${account.firstName},</p>
  
            <p>I’m David from Eventscape. I noticed you were trying to create an event but didn’t quite get through the process. </p>
            
            <p>Is there anything I can do to help? I’m here to answer any questions you might have.</p> 

            <p>If you would like to resume creating your event, you can do so <a href="https://app.eventscape.io/create-event">here</a>.</p>

            <p>Kind regards,</p>
            
            <strong>David Andrzejewski | Head of Product</strong>
          <p>PH4 - 73 Richmond Street West</p>
          <p>Toronto, Ontario, Canada, M5V 1V6</p>
          <p>+1 (912) 403-9854</p>
          <a href="https://www.eventscape.io">Eventscape.io</a>`,
          },
          {
            email: "david.andrzejewski@eventscape.io",
            name: "David Andrzejewski",
          }
        );
      }
    });

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
      where: {
        emailAddress: emailAddress.toLowerCase(),
        registrationComplete: true,
      },
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
