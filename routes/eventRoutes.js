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

router.post("/api/event", async (req, res) => {
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
    },
    communications,
  } = req.body;

  const AccountId = req.user.id;

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
  });

  // create a default chatroom
  const chatRoom = await ChatRoom.create({
    event: event.id,
    isDefault: true,
    name: "Main Chat (Default)",
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
});

router.post("/api/event/duplicate", async (req, res) => {
  const { EventId, link } = req.body;

  const AccountId = req.user.id;

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
  });

  // create a default chatroom
  const chatRoom = await ChatRoom.create({
    event: event.id,
    isDefault: true,
    name: "Main Chat (Default)",
  });

  // Store the section HTML for the reg page model
  const originalRegPageModel = await PageSection.findAll({
    where: { PageModelId: originalEvent.RegPageModelId },
  });
  console.log(event.RegPageModelId);
  console.log(originalRegPageModel);
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
});

router.get("/api/event/current", requireAuth, async (req, res) => {
  const AccountId = req.user.id;
  const event = await Event.findOne({ where: { AccountId, isCurrent: true } });

  res.status(200).send(event);
});

router.put("/api/event/id/make-current", async (req, res) => {
  const AccountId = req.user.id;
  const { id } = req.body;

  await Event.update({ isCurrent: false }, { where: { AccountId } });

  const event = await Event.findByPk(id);
  event.isCurrent = true;
  event.save();

  res.status(200).send();
});

router.get("/api/event/all", async (req, res) => {
  const AccountId = req.user.id;

  const events = await Event.findAll({ where: { AccountId } });

  res.status(200).send(events);
});

router.get("/api/event/id", async (req, res) => {
  const { id } = req.query;

  const event = await Event.findByPk(id);

  res.send(event);
});

router.get("/api/event/link", async (req, res) => {
  const { link } = req.query;
  const event = await Event.findOne({
    where: { link, status: statusOptions.ACTIVE },
  });

  res.status(200).send(event);
});

router.put("/api/event/id/status", async (req, res) => {
  const { id, status } = req.body;

  const event = await Event.findByPk(id);
  event.status = status;
  await event.save();

  res.send(event);
});

router.put("/api/event", async (req, res) => {
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
  } = req.body;

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

  console.log(status);
  await event.save();

  res.send(event);
});

router.put("/api/event/set-registration", async (req, res) => {
  const { hasRegistration, EventId } = req.body;

  const event = await Event.findByPk(EventId);

  console.log(event);
  console.log(hasRegistration, EventId);

  event.hasRegistration = hasRegistration;

  await event.save();

  res.status(200).send(event);
});

router.get("/api/event/chatroom/default", async (req, res) => {
  //This route gets the default chatroom for an event. If the chatroom doesn't exist it creates one
  const { event } = req.query;

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
});

router.get("/api/event/chatroom/all", async (req, res) => {
  const { event } = req.query;
  const chatRooms = await ChatRoom.findAll({
    where: {
      event,
    },
  });

  res.status(200).send(chatRooms);
});

router.put("/api/event/chatroom", async (req, res) => {
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
  } catch (err) {
    res.status(400).send({ message: "Error while updating chatroom" });
  }
});

router.delete("/api/event/chatroom", async (req, res) => {
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
  } catch (err) {
    res.status(400).send({ message: "Error while deleting chat room" });
  }
});

router.post("/api/event/chatroom", async (req, res) => {
  //This route gets the default chatroom for an event. If the chatroom doesn't exist it creates one
  const { room, event } = req.body;

  console.log(room, event);

  const newRoom = await ChatRoom.create({ name: room.name, event });

  res.status(200).send(newRoom);
});

router.get("/api/event/chat-moderator", async (req, res) => {
  const { EventscapeId, ChatRoomId } = req.query;

  const [chatUser, created] = await ChatUser.findOrCreate({
    where: {
      EventscapeId,
      ChatRoomId,
    },
  });

  console.log(chatUser);
  console.log(created);

  if (created) chatUser.name = "Moderator";
  chatUser.save();
  console.log(chatUser);

  res.status(200).send(chatUser);
});

router.put("/api/event/chat-moderator", async (req, res) => {
  const {
    user: { EventscapeId, name, ChatRoomId },
  } = req.body;

  const chatUser = await ChatUser.findOne({
    where: {
      EventscapeId,
      ChatRoomId,
    },
  });

  chatUser.name = name;
  chatUser.save();

  res.status(200).send(chatUser);
});

module.exports = router;
