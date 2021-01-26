const express = require("express");
const router = express.Router();
const { ChatRoom, ChatUser } = require("../db").models;

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

router.put("/api/chatuser", async (req, res, next) => {
  const { AccountId, ChatRoomId, name } = req.body;

  const [dbUser, created] = await ChatUser.findOrCreate({
    where: {
      AccountId,
      ChatRoomId,
    },
  }).catch(next);

  console.log(dbUser, created);

  dbUser.name = name;
  dbUser.save();

  res.status(200).send();
});

router.get("/api/chatuser", async (req, res, next) => {
  const { AccountId, ChatRoomId } = req.query;

  const [dbUser, created] = await ChatUser.findOrCreate({
    where: {
      AccountId,
      ChatRoomId,
    },
  }).catch(next);

  if (created) {
    dbUser.name = "Moderator";
    await dbUser.save();
  }

  res.status(200).send(dbUser);
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
      .send({ message: "You cannot delete the primary chat room." });

  if (chatRoom) await chatRoom.destroy().catch(next);

  res.status(200).send();
});

router.post("/api/chatroom", async (req, res, next) => {
  //This route gets the default chatroom for an event. If the chatroom doesn't exist it creates one
  const { room, event } = req.body;

  console.log(room, event);

  const newRoom = await ChatRoom.create({ name: room.name, event }).catch(next);

  res.status(200).send(newRoom);
});

module.exports = router;
