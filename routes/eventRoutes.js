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
    },
    communications,
  } = req.body;

  const AccountId = req.user.id;

  // set all other events isCurrent to false so we can make our new event current
  await Event.update({ isCurrent: false }, { where: { AccountId } }).catch(
    next
  );

  // Store a new model in the model table for the registration page
  const dbRegModel = await PageModel.create().catch(next);

  // Store a new model in the model table for the event page
  const dbEventModel = await PageModel.create().catch(next);

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
  }).catch(next);

  // create a default chatroom
  const chatRoom = await ChatRoom.create({
    event: event.id,
    isDefault: true,
    name: "Main (Default)",
  }).catch(next);

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

router.post("/api/event/duplicate", async (req, res, next) => {
  const { EventId, link } = req.body;

  const AccountId = req.user.id;

  // Store a new model in the model table for the registration page
  const dbRegModel = await PageModel.create().catch(next);

  // Store a new model in the model table for the event page
  const dbEventModel = await PageModel.create().catch(next);

  // fetch data from the original event
  const originalEvent = await Event.findByPk(EventId).catch(next);

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
  }).catch(next);

  // create a default chatroom
  const chatRoom = await ChatRoom.create({
    event: event.id,
    isDefault: true,
    name: "Main (Default)",
  }).catch(next);

  // Store the section HTML for the reg page model
  const originalRegPageModel = await PageSection.findAll({
    where: { PageModelId: originalEvent.RegPageModelId },
  }).catch(next);

  for (let section of originalRegPageModel) {
    await PageSection.create({
      PageModelId: dbRegModel.id,
      index: section.index,
      html: section.html,
      isReact: section.isReact,
      reactComponent: section.reactComponent,
    }).catch(next);
  }

  // Store the section HTML for the event page model
  const originalEventPageModel = await PageSection.findAll({
    where: { PageModelId: originalEvent.EventPageModelId },
  }).catch(next);

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
  }).catch(next);

  // add the emails for this event
  for (var communication of originalCommunications) {
    await Communication.create({
      subject: communication.subject,
      recipients: communication.recipients,
      minutesFromEvent: communication.minutesFromEvent,
      html: communication.html,
      EventId: event.id,
      status: communication.status,
    }).catch(next);
  }

  res.status(200).send(event);
});

router.get("/api/event/current", requireAuth, async (req, res, next) => {
  const AccountId = req.user.id;
  const event = await Event.findOne({
    where: { AccountId, isCurrent: true },
  }).catch(next);

  res.status(200).send(event);
});

router.put("/api/event/id/make-current", async (req, res, next) => {
  const AccountId = req.user.id;
  const { id } = req.body;

  await Event.update({ isCurrent: false }, { where: { AccountId } }).catch(
    next
  );

  const event = await Event.findByPk(id).catch(next);
  event.isCurrent = true;
  event.save();

  res.status(200).send();
});

router.get("/api/event/all", async (req, res, next) => {
  const AccountId = req.user.id;

  const events = await Event.findAll({ where: { AccountId } }).catch(next);

  res.status(200).send(events);
});

router.get("/api/event/id", async (req, res, next) => {
  const { id } = req.query;

  const event = await Event.findByPk(id).catch(next);

  res.send(event);
});

router.get("/api/event/link", async (req, res, next) => {
  const { link } = req.query;
  const event = await Event.findOne({
    where: { link, status: statusOptions.ACTIVE },
  }).catch(next);

  res.status(200).send(event);
});

router.put("/api/event/id/status", async (req, res, next) => {
  const { id, status } = req.body;

  const event = await Event.findByPk(id).catch(next);
  event.status = status;
  await event.save().catch(next);

  res.send(event);
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
  } = req.body;

  const event = await Event.findOne({
    where: { AccountId: userId, isCurrent: true },
  }).catch(next);

  event.title = title;
  event.link = link;
  event.category = category;
  event.startDate = startDate;
  event.endDate = endDate;
  event.timeZone = timeZone;
  event.primaryColor = primaryColor;
  event.status = status;

  console.log(status);
  await event.save().catch(next);

  res.send(event);
});

router.put("/api/event/set-registration", async (req, res, next) => {
  const { hasRegistration, EventId } = req.body;

  const event = await Event.findByPk(EventId).catch(next);

  console.log(event);
  console.log(hasRegistration, EventId);

  event.hasRegistration = hasRegistration;

  await event.save().catch(next);

  res.status(200).send(event);
});

router.get("/api/chatroom/default", async (req, res, next) => {
  //This route gets the default chatroom for an event. If the chatroom doesn't exist it creates one
  const { event } = req.query;

  const [newRoom, created] = await ChatRoom.findOrCreate({
    where: {
      event,
      isDefault: true,
    },
  }).catch(next);

  if (created) {
    newRoom.name = "Main Room (Default)";
    await newRoom.save().catch(next);
  }

  res.status(200).send({ id: newRoom.id });
});

router.get("/api/chatroom/all", async (req, res, next) => {
  const { event } = req.query;
  const chatRooms = await ChatRoom.findAll({
    where: {
      event,
    },
  }).catch(next);

  res.status(200).send(chatRooms);
});

router.put("/api/chatroom", async (req, res, next) => {
  const {
    room: { id, name },
  } = req.body;
  const dbRoom = await ChatRoom.findOne({
    where: {
      id,
    },
  }).catch(next);

  dbRoom.name = name;
  dbRoom.save();

  res.status(200).send();
});

router.delete("/api/chatroom", async (req, res, next) => {
  const { id } = req.query;

  const chatRoom = await ChatRoom.findOne({
    where: {
      id,
    },
  }).catch(next);
  if (chatRoom.isDefault)
    return res
      .status(400)
      .send({ error: "You cannot delete the primary chat room." });
  if (chatRoom) await chatRoom.destroy().catch(next);

  res.status(200).send();
});

router.post("/api/chatroom", async (req, res, next) => {
  //This route gets the default chatroom for an event. If the chatroom doesn't exist it creates one
  const { room, event } = req.body;

  const newRoom = await ChatRoom.create({ name: room.name, event }).catch(next);

  res.status(200).send(newRoom);
});

router.get("/api/event/chat-moderator", async (req, res, next) => {
  const { AccountId, ChatRoomId } = req.query;

  const [chatUser, created] = await ChatUser.findOrCreate({
    where: {
      AccountId,
      ChatRoomId,
    },
  }).catch(next);

  if (created) chatUser.name = "Moderator";
  chatUser.save();

  res.status(200).send(chatUser);
});

router.put("/api/event/chat-moderator", async (req, res, next) => {
  const {
    user: { AccountId, name, ChatRoomId },
  } = req.body;

  const chatUser = await ChatUser.findOne({
    where: {
      AccountId,
      ChatRoomId,
    },
  }).catch(next);

  chatUser.name = name;
  chatUser.save().catch(next);

  res.status(200).send(chatUser);
});

module.exports = router;
