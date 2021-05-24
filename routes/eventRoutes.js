const express = require("express");
const router = express.Router();

const requireAuth = require("../middlewares/requireAuth");

const {
  ChatRoom,
  ChatUser,
  Event,
  EventCached,
  PageModel,
  PageSection,
  Communication,
  Permission,
  Account,
  Invoice,
  Plan,
  PlanType,
  InvoiceLineItem,
  Poll,
  PollOption,
} = require("../db").models;
const { recipientsOptions, statusOptions } = require("../model/enums");
const { inviteUser } = require("../services/Invitations");
const { clearCache } = require("../services/sequelizeRedis");
const { sendEmail } = require("../services/Mailer");

router.post("/api/event/finalize", requireAuth, async (req, res, next) => {
  const {
    event: {
      title,
      link,
      category,
      startDate,
      endDate,
      timeZone,
      primaryColor,
      regPageModel,
      eventPageModel,
      registrationRequired,
      description,
      backgroundImage,
      backgroundColor,
      backgroundBlur,
    },
    communications,
    eventId,
  } = req.body;

  const accountId = req.user.id;

  try {
    // Store a new model in the model table for the registration page
    const dbRegModel = await PageModel.create({
      backgroundImage,
      backgroundColor,
      backgroundBlur,
    });

    // Store a new model in the model table for the event page
    const dbEventModel = await PageModel.create({
      backgroundImage,
      backgroundColor,
      backgroundBlur,
    });

    // add the remaining parts of the event which was created during the first step in the questionnaire
    const event = await Event.findByPk(eventId);
    event.title = title;

    event.link = link;
    event.category = category;
    event.startDate = startDate;
    event.endDate = endDate;
    event.timeZone = timeZone;
    event.primaryColor = primaryColor;
    event.RegPageModelId = dbRegModel.id;
    event.EventPageModelId = dbEventModel.id;
    event.status = statusOptions.ACTIVE;
    event.registrationRequired = registrationRequired;
    event.OwnerId = accountId;
    event.description = description;

    const savedEvent = await event.save();

    // create a default chatroom
    const chatRoom = await ChatRoom.create({
      event: event.id,
      isDefault: true,
      name: "Main (Default)",
    });

    // Store the section HTML for the reg page model
    for (i = 0; i < regPageModel.length; i++) {
      if (
        regPageModel[i].isReact &&
        regPageModel[i].reactComponent.name == "StreamChat"
      ) {
        regPageModel[i].reactComponent.props.chatRoom = chatRoom.id;
      }

      await PageSection.create({
        PageModelId: dbRegModel.id,
        index: i,
        html: regPageModel[i].html,
        isReact: regPageModel[i].isReact,
        reactComponent: regPageModel[i].reactComponent,
      });
    }

    // Store the section HTML for the event page model
    for (i = 0; i < eventPageModel.length; i++) {
      if (
        eventPageModel[i].isReact &&
        eventPageModel[i].reactComponent.name == "StreamChat"
      ) {
        eventPageModel[i].reactComponent.props.chatRoom = chatRoom.id;
      }

      await PageSection.create({
        PageModelId: dbEventModel.id,
        index: i,
        html: eventPageModel[i].html,
        isReact: eventPageModel[i].isReact,
        reactComponent: eventPageModel[i].reactComponent,
      });
    }

    // add the emails for this event
    for (var communicationDetails of communications) {
      const communication = await Communication.create({
        subject: communicationDetails.subject,
        recipients: communicationDetails.recipients,
        minutesFromEvent: communicationDetails.minutesFromEvent,
        html: communicationDetails.html,
        EventId: event.id,
        status: communicationDetails.status,
      });
    }

    // set this event as the currently editing event for this account
    const account = await Account.findByPk(accountId);
    account.currentEventId = event.id;
    account.save();

    // add a permission in the permissions table for the event creator
    await Permission.create({
      EventId: event.id,
      AccountId: accountId,
      role: "owner",
      eventDetails: true,
      communication: true,
      registration: true,
      analytics: true,
      messaging: true,
      design: true,
      polls: true,
    });

    // create a default plan and invoice
    const defaultFreePlan = await PlanType.findOne({ where: { type: "free" } });

    const invoice = await Invoice.create({ EventId: event.id });
    const plan = await Plan.create({
      EventId: event.id,
      PlanTypeId: defaultFreePlan.id,
    });
    const invoiceLineItem = await InvoiceLineItem.create({
      InvoiceId: invoice.id,
      type: "plan",
      PlanId: plan.id,
    });

    res.json(event);
  } catch (error) {
    next(error);
  }
});

router.post("/api/event", requireAuth, async (req, res, next) => {
  const { title } = req.body;

  console.log(title);

  const accountId = req.user.id;

  try {
    const event = await Event.create({
      title,
      OwnerId: accountId,
      status: statusOptions.INCOMPLETE,
    });

    res.json(event);
  } catch (error) {
    next(error);
  }
});

router.post("/api/event/duplicate", requireAuth, async (req, res, next) => {
  const { EventId, link } = req.body;

  const accountId = req.user.id;

  try {
    // Store a new model in the model table for the registration page
    const dbRegModel = await PageModel.create();

    // Store a new model in the model table for the event page
    const dbEventModel = await PageModel.create();

    // fetch data from the original event
    const originalEvent = await Event.findByPk(EventId);

    // Create a new event with the desired link, the original name + copy, and all the rest of the original details
    const event = await Event.create({
      title: originalEvent.title + " Copy",
      link,
      category: originalEvent.category,
      startDate: originalEvent.startDate,
      endDate: originalEvent.endDate,
      timeZone: originalEvent.timeZone,
      primaryColor: originalEvent.primaryColor,
      OwnerId: originalEvent.AccountId,
      RegPageModelId: dbRegModel.id,
      EventPageModelId: dbEventModel.id,
      registrationRequired: originalEvent.registrationRequired,
      status: originalEvent.status,
    });

    // create a new default chatroom
    const chatRoom = await ChatRoom.create({
      event: event.id,
      isDefault: true,
      name: "Main (Default)",
    });

    // Store the section HTML for the reg page model
    const originalRegPageModel = await PageSection.findAll({
      where: { PageModelId: originalEvent.RegPageModelId },
    });

    for (let section of originalRegPageModel) {
      // update the chatroom (in case one exists) to the newly created chatroom
      if (section.isReact && section.reactComponent.name == "StreamChat") {
        section.reactComponent.props.chatRoom = chatRoom.id;
      }

      await PageSection.create({
        PageModelId: dbRegModel.id,
        index: section.index,
        html: section.html,
        isReact: section.isReact,
        reactComponent: section.reactComponent,
      });
    }

    // Store the section HTML for the event page model
    const originalEventPageModel = await PageSection.findAll({
      where: { PageModelId: originalEvent.EventPageModelId },
    });

    for (let section of originalEventPageModel) {
      // update the chatroom to the newly created chatroom
      if (section.isReact && section.reactComponent.name == "StreamChat") {
        section.reactComponent.props.chatRoom = chatRoom.id;
      }

      await PageSection.create({
        PageModelId: dbEventModel.id,
        index: section.index,
        html: section.html,
        isReact: section.isReact,
        reactComponent: section.reactComponent,
      });
    }

    // add the emails for this event
    const originalCommunications = await Communication.findAll({
      where: { EventId },
    });

    for (var communicationDetails of originalCommunications) {
      const communication = await Communication.create({
        subject: communicationDetails.subject,
        recipients: communicationDetails.recipients,
        minutesFromEvent: communicationDetails.minutesFromEvent,
        html: communicationDetails.html,
        EventId: event.id,
        status: communicationDetails.status,
      });
    }

    // copy over permissions
    const permissions = await Permission.findAll({ where: { EventId } });

    for (var permission of permissions) {
      Permission.create({
        EventId: event.id,
        AccountId: permission.AccountId,
        role: permission.role,
        eventDetails: permission.eventDetails,
        communication: permission.communication,
        registration: permission.registration,
        analytics: permission.analytics,
        messaging: permission.messaging,
        design: permission.design,
        polls: permission.polls,
      });
    }

    // copy over poll questions
    const polls = await Poll.findAll({ where: { EventId } });

    for (var poll of polls) {
      // for each poll created in the original event
      // create a copy of the poll
      const pollCopy = await Poll.create({
        EventId: event.id,
        question: poll.question,
        allowMultiple: poll.allowMultiple,
        isLaunched: false,
      });

      // copy poll options from original poll
      const pollOptions = await PollOption.findAll({
        where: { PollId: poll.id },
      });

      for (var pollOption of pollOptions) {
        PollOption.create({ PollId: pollCopy.id, text: pollOption.text });
      }
    }

    // create a default plan and invoice
    const defaultFreePlan = await PlanType.findOne({ where: { type: "free" } });

    const invoice = await Invoice.create({ EventId: event.id });
    const plan = await Plan.create({
      EventId: event.id,
      PlanTypeId: defaultFreePlan.id,
    });
    InvoiceLineItem.create({
      InvoiceId: invoice.id,
      type: "plan",
      PlanId: plan.id,
    });

    res.json(event);
  } catch (error) {
    next(error);
  }
});

router.get("/api/event/current", requireAuth, async (req, res, next) => {
  const accountId = req.user.id;
  try {
    const account = await Account.findByPk(accountId);

    var event;
    // if the account has an event they are currently editting, then fetch that event
    if (account.currentEventId) {
      event = await Event.findByPk(account.currentEventId);
    } else {
      // else just fetch the first event they are an owner of as a fallback
      event = await Event.findOne({
        where: { OwnerId: accountId },
      });
    }

    // if there's no event (i.e. on create event page), return an empty object
    if (!event) return res.send();

    const plan = await Plan.findOne({
      where: { EventId: event.id },
      include: PlanType,
    });

    const permissions = await Permission.findAll({
      where: {
        EventId: event.id,
      },
      include: Account,
    });

    res.json({ ...event.dataValues, plan, permissions });
  } catch (error) {
    next(error);
  }
});

router.put(
  "/api/event/id/make-current",
  requireAuth,
  async (req, res, next) => {
    const accountId = req.user.id;
    const { eventId } = req.body;

    try {
      const permission = await Permission.findOne({
        where: { AccountId: accountId, EventId: eventId },
      });
      if (permission) {
        const account = await Account.findByPk(accountId);
        account.currentEventId = eventId;
        await account.save();

        res.json();
      } else {
        const event = await Event.findByPk(eventId);
        res.status(400).send({
          message: `You do not have permissions for the event titled: ${event.title}. Please contact the owner of this event to give you permissions.`,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

router.get("/api/event/all", requireAuth, async (req, res, next) => {
  const accountId = req.user.id;
  const events = [];

  try {
    const permissions = await Permission.findAll({
      where: { AccountId: accountId },
    });
    for (let permission of permissions) {
      events.push(await Event.findByPk(permission.EventId));
    }

    res.json(events);
  } catch (error) {
    next(error);
  }
});

// public endpoint
router.get("/api/event/id", async (req, res, next) => {
  const { id } = req.query;

  try {
    const event = await Event.findByPk(id);

    if (event) {
      const plan = await Plan.findOne({
        where: { EventId: event.id },
        include: PlanType,
      });

      res.json({ ...event.dataValues, plan });
    } else {
      res.json();
    }
  } catch (error) {
    next(error);
  }
});

// public endpoint
router.get("/api/event/link", async (req, res, next) => {
  const { link } = req.query;

  try {
    const eventCacheKey = `Event:link:${link}`;
    const [event, eventCacheHit] = await EventCached.findOneCached(
      eventCacheKey,
      {
        where: { link, status: statusOptions.ACTIVE },
      }
    );

    if (event) {
      const plan = await Plan.findOne({
        where: { EventId: event.id },
        include: PlanType,
      });

      res.json({ ...event.dataValues, plan });
    } else res.json();
  } catch (error) {
    next(error);
  }
});

router.put("/api/event/id/status", requireAuth, async (req, res, next) => {
  const { id, status } = req.body;

  try {
    const event = await Event.findByPk(id);
    event.status = status;
    await event.save();
    clearCache(`Event:link:${event.link}`);

    res.send(event);
  } catch (error) {
    next(error);
  }
});

router.put("/api/event", requireAuth, async (req, res, next) => {
  const accountId = req.user.id;

  const {
    eventId,
    title,
    link,
    category,
    startDate,
    endDate,
    timeZone,
    primaryColor,
    registrationRequired,
    description,
  } = req.body;

  try {
    const account = await Account.findByPk(accountId);
    const event = await Event.findByPk(eventId);
    if (!event) {
      res.status(400).send({ message: "Event not found" });
    }
    const eventTimeChanged = event.startDate != startDate;

    clearCache(`Event:link:${event.link}`);

    // update event attributes. If they are not provided, use the previous values
    event.title = title || event.title;
    event.link = link || event.link;
    event.category = category || event.category;
    event.startDate = startDate || event.startDate;
    event.endDate = endDate || event.endDate;
    event.timeZone = timeZone || event.timeZone;
    event.primaryColor = primaryColor || event.primaryColor;
    event.description = description || event.description;
    if (registrationRequired != null) {
      event.registrationRequired = registrationRequired;
    }

    await event.save();

    res.send(event);
  } catch (error) {
    next(error);
  }
});

router.post("/api/event/permissions", requireAuth, async (req, res, next) => {
  const { eventId, emailAddress } = req.body;
  const account = req.user;

  try {
    // if an account exists, we will add permissions to that account
    // if an account doesn't exist, we will create one with registrationComplete set to false. The user will need to complete registration
    const [targetAccount, targetAccountCreated] = await Account.findOrCreate({
      where: { emailAddress },
    });

    const [permission, permissionCreated] = await Permission.findOrCreate({
      where: {
        AccountId: targetAccount.id,
        EventId: eventId,
      },
    });

    if (!permissionCreated) {
      return res
        .status(400)
        .send({ message: "This user already has permissions to this event" });
    }

    const event = await Event.findByPk(eventId);

    inviteUser(
      emailAddress,
      account.firstName,
      event.title,
      event.id,
      targetAccountCreated
    );

    res.json(permission);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/api/event/transfer-ownership",
  requireAuth,
  async (req, res, next) => {
    const { eventId, oldAccountId, newAccountId } = req.body;

    try {
      const event = await Event.findByPk(eventId);
      event.OwnerId = newAccountId;
      event.save();

      const oldPermission = await Permission.findOne({
        where: { EventId: eventId, AccountId: oldAccountId },
      });
      oldPermission.role = "collaborator";
      oldPermission.save();

      const newPermission = await Permission.findOne({
        where: { EventId: eventId, AccountId: newAccountId },
      });
      newPermission.role = "owner";
      newPermission.eventDetails = true;
      newPermission.design = true;
      newPermission.polls = true;
      newPermission.analytics = true;
      newPermission.messaging = true;
      newPermission.communication = true;
      newPermission.registration = true;
      newPermission.save();

      const oldOwnerAccount = await Account.findByPk(oldAccountId);
      const newOwnerAccount = await Account.findByPk(newAccountId);

      const subject = `${oldOwnerAccount.firstName}  has transferred ownership of an event to you`;
      const html = `
      <p style="text-align: left">Hello ${newOwnerAccount.firstName}, </p>
      <p style="text-align: left">${oldOwnerAccount.firstName} has transferred ownership of the event "${event.title}" to you. </p>

      <p style="text-align: left">You may view the event using the link below:</p>
      <a href="https://app.eventscape.io/?eventid=${eventId}"><p style="text-align: left">https://app.eventscape.io/?eventid=${eventId}</p></a>

       <p style="text-align: left">Good luck on your event,</p>
    <p style="text-align: left">The Eventscape Team</p>
    <a href="https://www.eventscape.io"><p style="text-align: left">https://www.eventscape.io</p></a>

      `;

      sendEmail({
        to: newOwnerAccount.emailAddress,
        subject,
        html,
        useTemplate: true,
      });

      res.json();
    } catch (error) {
      next(error);
    }
  }
);

router.get("/api/event/permissions", requireAuth, async (req, res, next) => {
  const { eventId } = req.query;

  try {
    const permissions = await Permission.findAll({
      where: {
        EventId: eventId,
      },
      include: Account,
    });

    res.json(permissions);
  } catch (error) {
    next(error);
  }
});

router.delete("/api/event/permissions", requireAuth, async (req, res, next) => {
  const { permissionId } = req.query;

  try {
    const response = await Permission.destroy({
      where: {
        id: permissionId,
      },
    });

    res.json();
  } catch (error) {
    next(error);
  }
});

router.put("/api/event/permissions", requireAuth, async (req, res, next) => {
  const { type, checked, permissionId } = req.body;

  try {
    const permission = await Permission.findByPk(permissionId);

    switch (type) {
      case "eventDetails":
        permission.eventDetails = checked;
        break;
      case "design":
        permission.design = checked;
        break;
      case "communication":
        permission.communication = checked;
        break;
      case "registration":
        permission.registration = checked;
        break;
      case "polls":
        permission.polls = checked;
        break;
      case "analytics":
        permission.analytics = checked;
        break;
      case "messaging":
        permission.messaging = checked;
        break;
    }

    permission.save();

    res.json(permission);
  } catch (error) {
    next(error);
  }
});

router.post("/api/event/reminder", requireAuth, async (req, res, next) => {
  try {
    const { emailAddress, event } = req.body;

    const html = `<p>Hello,</p>
<p>Thank you for creating ${event.title} on Eventscape from your mobile device!</p>
<p>To continue editing the photos and content of your site, click the following link on a laptop or desktop computer:</p>
<p><a href="https://app.eventscape.io/?eventid=${event.id}&tour=true">https://app.eventscape.io/?eventid=${event.id}&tour=true</a></p>
<p>Thank you,</p>
<p>The Eventscape team</p>`;

    sendEmail({
      to: emailAddress,
      subject: `Continue Designing ${event.title}`,
      html,
      useTemplate: true,
    });

    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
