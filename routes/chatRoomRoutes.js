const express = require("express");
const router = express.Router();
const { ChatRoom, ChatUser } = require("../db").models;

router.get("/api/chatroom/default", async (req, res) => {
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

router.get("/api/chatroom/all", async (req, res) => {
  const { event } = req.query;
  const chatRooms = await ChatRoom.findAll({
    where: {
      event,
    },
  });

  res.status(200).send(chatRooms);
});

router.put("/api/chatroom", async (req, res) => {
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

router.put("/api/chatuser", async (req, res) => {
  const { EventscapeId, ChatRoomId, name } = req.body;
  console.log(EventscapeId, name);

  try {
    const [dbUser, created] = await ChatUser.findOrCreate({
      where: {
        EventscapeId,
        ChatRoomId,
      },
    });

    console.log(dbUser, created);

    dbUser.name = name;
    dbUser.save();

    res.status(200).send();
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "Error while updating moderator name" });
  }
});

router.get("/api/chatuser", async (req, res) => {
  const { EventscapeId, ChatRoomId } = req.query;

  try {
    const [dbUser, created] = await ChatUser.findOrCreate({
      where: {
        EventscapeId,
        ChatRoomId,
      },
    });

    if (created) {
      dbUser.name = "Moderator";
      await dbUser.save();
    }

    res.status(200).send(dbUser);
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "Error while updating moderator name" });
  }
});

router.delete("/api/chatroom", async (req, res) => {
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

router.post("/api/chatroom", async (req, res) => {
  //This route gets the default chatroom for an event. If the chatroom doesn't exist it creates one
  const { room, event } = req.body;

  console.log(room, event);

  const newRoom = await ChatRoom.create({ name: room.name, event });

  res.status(200).send(newRoom);
});

module.exports = router;
