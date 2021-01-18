const express = require("express");
const router = express.Router();

const db = require("../db");
const requireAuth = require("../middlewares/requireAuth");

const {
  ChatRoom,
  ChatUser,
  Event,
  PageModel,
  PageSection,
  Communication,
} = require("../sequelize").models;
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
    emails,
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
  for (var email of emails) {
    await Communication.create({
      subject: email.subject,
      recipients: email.recipients,
      minutesFromEvent: email.minutesFromEvent,
      html: email.html,
      EventId: event.id,
      status: email.status,
    });
  }

  res.status(200).send(event);
});

router.get("/api/event/current", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const events = await db.query(
    "SELECT * FROM event WHERE user_id=$1 AND is_current=true",
    [userId],
    (err, res) => {
      if (err) {
        throw res.status(500).send(err);
      }
    }
  );

  res.send(events.rows[0]);
});

router.put("/api/event/id/make-current", async (req, res) => {
  const userId = req.user.id;
  const { id } = req.body;

  await db.query(
    "UPDATE event SET is_current=false WHERE user_id=$1",
    [userId],
    (err, res) => {
      if (err) {
        throw res.status(500).send(err);
      }
    }
  );

  await db.query(
    "UPDATE event SET is_current=true WHERE id=$1",
    [id],
    (err, res) => {
      if (err) {
        throw res.status(500).send(err);
      }
    }
  );

  res.status(200).send();
});

router.get("/api/event/all", async (req, res) => {
  const userId = req.user.id;
  const events = await db.query(
    "SELECT * FROM event WHERE user_id=$1",
    [userId],
    (err, res) => {
      if (err) {
        throw res.status(500).send(err);
      }
    }
  );

  res.send(events.rows);
});

router.get("/api/event/id", async (req, res) => {
  const { id } = req.query;
  const events = await db.query(
    "SELECT * FROM event WHERE id=$1",
    [id],
    (err, res) => {
      if (err) {
        throw res.status(500).send(err);
      }
    }
  );

  res.send(events.rows[0]);
});

router.get("/api/event/link", async (req, res) => {
  const { link } = req.query;
  const event = await Event.findOne({ where: { link } });

  res.status(200).send(event);
});

router.put("/api/event/id/status", async (req, res) => {
  const { id, status } = req.body;
  const response = await db.query(
    "UPDATE event SET status=$2 WHERE id=$1 RETURNING *",
    [id, status],
    (err, res) => {
      if (err) {
        throw res.status(500).send(err);
      }
    }
  );

  console.log(response.rows);

  res.send(response);
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

  const events = await db.query(
    `UPDATE event 
		SET 
		  title = $1, 
		  link = $2, 
		  category = $3,
		  startDate = $4,
		  endDate = $5, 
		  timeZone = $6,
		  primaryColor = $7,
		  status = $8
		WHERE 
		  user_id=$9 AND is_current=true
		RETURNING *`,
    [
      title,
      link,
      category,
      startDate,
      endDate,
      timeZone,
      primaryColor,
      status,
      userId,
    ],
    (err, res) => {
      if (err) {
        throw res.status(500).send(err);
      }
    }
  );

  res.send(events.rows[0]);
});

router.put("/api/event/set-registration", async (req, res) => {
  const { registrationEnabled, event } = req.body;

  const updatedEvent = await db.query(
    `
  UPDATE event
  SET registration = $1
  WHERE id = $2
  RETURNING *`,
    [registrationEnabled, event],
    (err, res) => {
      if (errDb) {
        throw res.status(500).send(err);
      }
    }
  );

  res.status(200).send(updatedEvent.rows[0]);
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
