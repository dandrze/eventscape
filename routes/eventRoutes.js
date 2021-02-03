const express = require("express");
const router = express.Router();

const requireAuth = require("../middlewares/requireAuth");

const {
  ChatRoom,
  ChatUser,
  Event,
  PageModel,
  PageSection,
  Communication,
} = require("../db").models;
const { recipientsOptions, statusOptions } = require("../model/enums");

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

  const AccountId = req.user.id;

  try {
    // set all other events isCurrent to false so we can make our new event current
    await Event.update({ isCurrent: false }, { where: { AccountId } });

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
      isCurrent: true,
      AccountId,
      RegPageModelId: dbRegModel.id,
      EventPageModelId: dbEventModel.id,
      status: statusOptions.ACTIVE,
      registrationRequired,
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
      isCurrent: false,
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
  const AccountId = req.user.id;
  try {
    const event = await Event.findOne({
      where: { AccountId, isCurrent: true },
    });

    res.status(200).send(event);
  } catch (error) {
    next(error);
  }
});

router.put("/api/event/id/make-current", async (req, res, next) => {
  const AccountId = req.user.id;
  const { id } = req.body;

  try {
    await Event.update({ isCurrent: false }, { where: { AccountId } });

    const event = await Event.findByPk(id);
    event.isCurrent = true;
    await event.save();

    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

router.get("/api/event/all", async (req, res, next) => {
  const AccountId = req.user.id;

  try {
    const events = await Event.findAll({ where: { AccountId } });

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
    const event = await Event.findOne({
      where: { link, status: statusOptions.ACTIVE },
    });

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

    res.send(event);
  } catch (error) {
    next(error);
  }
});

router.put("/api/event", async (req, res, next) => {
  const userId = req.user.id;

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
    const event = await Event.findOne({
      where: { AccountId: userId, isCurrent: true },
    });

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

module.exports = router;
