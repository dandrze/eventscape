const express = require("express");
const router = express.Router();
const {
  ChatRoom,
  ChatUser,
  ChatMessage,
  ChatQuestion,
  Registration,
} = require("../db").models;

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

router.get("/api/chatroom/id", async (req, res, next) => {
  const { roomId } = req.query;

  try {
    const chatRoom = await ChatRoom.findByPk(roomId);

    res.status(200).send(chatRoom);
  } catch (error) {
    next(error);
  }
});

router.get("/api/chatroom/export/chat", async (req, res, next) => {
  const { roomId } = req.query;

  try {
    const chatMessages = await ChatMessage.findAll({
      where: { ChatRoomId: roomId },
      include: { model: ChatUser, include: Registration },
    });

    res.status(200).send(chatMessages);
  } catch (error) {
    next(error);
  }
});

router.get("/api/chatroom/export/questions", async (req, res, next) => {
  const { roomId } = req.query;

  try {
    const chatQuestions = await ChatQuestion.findAll({
      where: { ChatRoomId: roomId },
      include: { model: ChatUser, include: Registration },
    });

    res.status(200).send(chatQuestions);
  } catch (error) {
    next(error);
  }
});

router.get("/api/chatroom/all", async (req, res) => {
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

router.put("/api/chatuser", async (req, res, next) => {
  const { AccountId, ChatRoomId, name } = req.body;

  try {
    const [dbUser, created] = await ChatUser.findOrCreate({
      where: {
        AccountId,
        ChatRoomId,
      },
    });

    dbUser.name = name;
    dbUser.save();

    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

router.get("/api/chatuser", async (req, res, next) => {
  const { AccountId, ChatRoomId } = req.query;

  try {
    const [dbUser, created] = await ChatUser.findOrCreate({
      where: {
        AccountId,
        ChatRoomId,
      },
    });

    if (created) {
      dbUser.name = "Moderator";
      await dbUser.save();
    }

    res.status(200).send(dbUser);
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

router.put("/api/chatroom/tab-set-enabled", async (req, res, next) => {
  //This route gets the default chatroom for an event. If the chatroom doesn't exist it creates one
  const { roomId, chatEnabled, questionsEnabled } = req.body;

  try {
    const chatRoom = await ChatRoom.findByPk(roomId);
    chatRoom.chatEnabled = chatEnabled;
    chatRoom.questionsEnabled = questionsEnabled;
    await chatRoom.save();

    res.status(200).send(chatRoom);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
