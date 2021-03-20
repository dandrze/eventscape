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
} = require("../db").models;
const { recipientsOptions, statusOptions } = require("../model/enums");
const { inviteUser } = require("../services/Invitations");

const { clearCache } = require("../services/sequelizeRedis");

router.post("/api/event", async (req, res, next) => {
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
    },
    communications,
  } = req.body;

  const accountId = req.user.id;

  try {
    // Store a new model in the model table for the registration page
    const dbRegModel = await PageModel.create();

    // Store a new model in the model table for the event page
    const dbEventModel = await PageModel.create();

    // add the event to the event table. Make it the current event
    const event = await Event.create({
      title,
      link,
      category,
      startDate,
      endDate,
      timeZone,
      primaryColor,
      RegPageModelId: dbRegModel.id,
      EventPageModelId: dbEventModel.id,
      status: statusOptions.ACTIVE,
      registrationRequired,
      OwnerId: accountId,
    });

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
    for (var communication of communications) {
      await Communication.create({
        subject: communication.subject,
        recipients: communication.recipients,
        minutesFromEvent: communication.minutesFromEvent,
        html: communication.html,
        EventId: event.id,
        status: communication.status,
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

    res.status(200).send(event);
  } catch (error) {
    next(error);
  }
});

router.post("/api/event/duplicate", async (req, res, next) => {
  const { EventId, link } = req.body;

  const AccountId = req.user.id;

  try {
    // Store a new model in the model table for the registration page
    const dbRegModel = await PageModel.create();

    // Store a new model in the model table for the event page
    const dbEventModel = await PageModel.create();

    // fetch data from the original event
    const originalEvent = await Event.findByPk(EventId);

    // add the event to the event table. Make it the current event
    const event = await Event.create({
      title: originalEvent.title + " Copy",
      link,
      category: originalEvent.category,
      startDate: originalEvent.startDate,
      endDate: originalEvent.endDate,
      timeZone: originalEvent.timeZone,
      primaryColor: originalEvent.primaryColor,
      AccountId: originalEvent.AccountId,
      RegPageModelId: dbRegModel.id,
      EventPageModelId: dbEventModel.id,
      registrationRequired: dbEventModel.registrationRequired,
    });

    // create a default chatroom
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
      await PageSection.create({
        PageModelId: dbEventModel.id,
        index: section.index,
        html: section.html,
        isReact: section.isReact,
        reactComponent: section.reactComponent,
      });
    }

    const originalCommunications = await Communication.findAll({
      where: { EventId },
    });

    // add the emails for this event
    for (var communication of originalCommunications) {
      await Communication.create({
        subject: communication.subject,
        recipients: communication.recipients,
        minutesFromEvent: communication.minutesFromEvent,
        html: communication.html,
        EventId: event.id,
        status: communication.status,
      });
    }

    res.status(200).send(event);
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
      event = await Event.findOne({ where: { OwnerId: accountId } });
    }

    res.status(200).send(event);
  } catch (error) {
    next(error);
  }
});

router.put("/api/event/id/make-current", async (req, res, next) => {
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

      res.status(200).send();
    } else {
      const event = await Event.findByPk(eventId);
      res.status(400).send({
        message: `You do not have permissions for the event titled: ${event.title}. Please contact the owner of this event to give you permissions.`,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/api/event/all", async (req, res, next) => {
  const accountId = req.user.id;
  const events = [];

  try {
    const permissions = await Permission.findAll({
      where: { AccountId: accountId },
    });
    for (let permission of permissions) {
      events.push(await Event.findByPk(permission.EventId));
    }

    res.status(200).send(events);
  } catch (error) {
    next(error);
  }
});

router.get("/api/event/id", async (req, res, next) => {
  const { id } = req.query;

  try {
    const event = await Event.findByPk(id);

    res.send(event);
  } catch (error) {
    next(error);
  }
});

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

    res.status(200).send(event);
  } catch (error) {
    next(error);
  }
});

router.put("/api/event/id/status", async (req, res, next) => {
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

router.put("/api/event", async (req, res, next) => {
  const accountId = req.user.id;

  const {
    title,
    link,
    category,
    startDate,
    endDate,
    timeZone,
    primaryColor,
    status,
    registrationRequired,
  } = req.body;

  try {
    const account = await Account.findByPk(accountId);
    const event = await Event.findByPk(account.currentEventId);

    clearCache(`Event:link:${event.link}`);

    event.title = title;
    event.link = link;
    event.category = category;
    event.startDate = startDate;
    event.endDate = endDate;
    event.timeZone = timeZone;
    event.primaryColor = primaryColor;
    event.status = status;
    event.registrationRequired = registrationRequired;

    await event.save();

    res.send(event);
  } catch (error) {
    next(error);
  }
});

router.get("/api/chatroom/default", async (req, res, next) => {
  //This route gets the default chatroom for an event. If the chatroom doesn't exist it creates one
  const { event } = req.query;

  try {
    const [newRoom, created] = await ChatRoom.findOrCreate({
      where: {
        event,
        isDefault: true,
      },
    });

    if (created) {
      newRoom.name = "Main Room (Default)";
      await newRoom.save();
    }

    res.status(200).send({ id: newRoom.id });
  } catch (error) {
    next(error);
  }
});

router.get("/api/chatroom/all", async (req, res, next) => {
  const { event } = req.query;

  try {
    const chatRooms = await ChatRoom.findAll({
      where: {
        event,
      },
    });

    res.status(200).send(chatRooms);
  } catch (error) {
    next(error);
  }
});

router.put("/api/chatroom", async (req, res, next) => {
  const {
    room: { id, name },
  } = req.body;

  try {
    const dbRoom = await ChatRoom.findOne({
      where: {
        id,
      },
    });

    dbRoom.name = name;
    dbRoom.save();

    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

router.delete("/api/chatroom", async (req, res, next) => {
  const { id } = req.query;

  try {
    const chatRoom = await ChatRoom.findOne({
      where: {
        id,
      },
    });
    if (chatRoom.isDefault)
      return res
        .status(400)
        .send({ message: "You cannot delete the primary chat room." });
    if (chatRoom) await chatRoom.destroy();

    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

router.post("/api/chatroom", async (req, res, next) => {
  //This route gets the default chatroom for an event. If the chatroom doesn't exist it creates one
  const { room, event } = req.body;

  try {
    const newRoom = await ChatRoom.create({ name: room.name, event });

    res.status(200).send(newRoom);
  } catch (error) {
    next(error);
  }
});

router.get("/api/event/chat-moderator", async (req, res, next) => {
  const { AccountId, ChatRoomId } = req.query;

  try {
    const [chatUser, created] = await ChatUser.findOrCreate({
      where: {
        AccountId,
        ChatRoomId,
      },
    });

    if (created) chatUser.name = "Moderator";
    chatUser.save();

    res.status(200).send(chatUser);
  } catch (error) {
    next(error);
  }
});

router.put("/api/event/chat-moderator", async (req, res, next) => {
  const {
    user: { AccountId, name, ChatRoomId },
  } = req.body;

  try {
    const chatUser = await ChatUser.findOne({
      where: {
        AccountId,
        ChatRoomId,
      },
    });

    chatUser.name = name;
    chatUser.save();

    res.status(200).send(chatUser);
  } catch (error) {
    next(error);
  }
});

router.post("/api/event/permissions", async (req, res, next) => {
  const { eventId, emailAddress } = req.body;
  const account = req.user;

  try {
    // if an account exists, we will add permissions to that account
    // if an account doesn't exist, we will create one with registrationComplete set to false. The user will need to complete registration
    const [account, accountCreated] = await Account.findOrCreate({
      where: { emailAddress },
    });

    const [permission, permissionCreated] = await Permission.findOrCreate({
      where: {
        AccountId: account.id,
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
      account.lastName,
      event.title,
      event.id,
      accountCreated
    );

    console.log("account created with " + emailAddress);
    // }

    res.status(200).send(permission);
  } catch (error) {
    next(error);
  }
});

router.post("/api/event/transfer-ownership", async (req, res, next) => {
  console.log(req.body);
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

    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

router.get("/api/event/permissions", async (req, res, next) => {
  const { eventId } = req.query;

  try {
    const permissions = await Permission.findAll({
      where: {
        EventId: eventId,
      },
      include: Account,
    });

    res.status(200).send(permissions);
  } catch (error) {
    next(error);
  }
});

router.delete("/api/event/permissions", async (req, res, next) => {
  const { permissionId } = req.query;

  try {
    const response = await Permission.destroy({
      where: {
        id: permissionId,
      },
    });

    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

router.put("/api/event/permissions", async (req, res, next) => {
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

    res.status(200).send(permission);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
