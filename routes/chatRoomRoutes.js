const express = require("express");
const router = express.Router();
const { ChatRoom, ChatUser, ChatMessage, ChatQuestion, Registration } =
  require("../db").models;

const requireAuth = require("../middlewares/requireAuth");
const { clearCache } = require("../services/sequelizeRedis");

router.get("/api/chatroom/all", requireAuth, async (req, res, next) => {
  const { event } = req.query;

  try {
    const chatRooms = await ChatRoom.findAll({
      where: {
        event,
      },
    });

    res.json(chatRooms);
  } catch (error) {
    next(error);
  }
});

router.put("/api/chatroom", requireAuth, async (req, res, next) => {
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

    res.json();
  } catch (error) {
    next(error);
  }
});

router.delete("/api/chatroom", requireAuth, async (req, res, next) => {
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

    res.json();
  } catch (error) {
    next(error);
  }
});

router.post("/api/chatroom", requireAuth, async (req, res, next) => {
  //This route gets the default chatroom for an event. If the chatroom doesn't exist it creates one
  const { room, event } = req.body;

  try {
    const newRoom = await ChatRoom.create({ name: room.name, event });

    res.json(newRoom);
  } catch (error) {
    next(error);
  }
});

router.get("/api/chatroom/chat-moderator", async (req, res, next) => {
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

    res.json(chatUser);
  } catch (error) {
    next(error);
  }
});

router.put(
  "/api/chatroom/chat-moderator",
  requireAuth,
  async (req, res, next) => {
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

      res.json(chatUser);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/api/chatroom/default", async (req, res, next) => {
  //This route gets the default chatroom for an event.
  const { event } = req.query;

  try {
    const chatRoom = await ChatRoom.findOne({
      where: {
        event,
        isDefault: true,
      },
    });

    res.json({ id: chatRoom.id });
  } catch (error) {
    next(error);
  }
});

router.get("/api/chatroom/id", async (req, res, next) => {
  const { roomId } = req.query;

  try {
    const chatRoom = await ChatRoom.findByPk(roomId);

    res.json(chatRoom);
  } catch (error) {
    next(error);
  }
});

router.get("/api/chatroom/export/chat", requireAuth, async (req, res, next) => {
  const { roomId } = req.query;

  try {
    const chatMessages = await ChatMessage.findAll({
      where: { ChatRoomId: roomId },
      include: { model: ChatUser, include: Registration },
    });

    res.json(chatMessages);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/api/chatroom/export/questions",
  requireAuth,
  async (req, res, next) => {
    const { roomId } = req.query;

    try {
      const chatQuestions = await ChatQuestion.findAll({
        where: { ChatRoomId: roomId },
        include: { model: ChatUser, include: Registration },
      });

      res.json(chatQuestions);
    } catch (error) {
      next(error);
    }
  }
);

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

    res.json();
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

    res.json(dbUser);
  } catch (error) {
    next(error);
  }
});

router.put(
  "/api/chatroom/tab-set-enabled",
  requireAuth,
  async (req, res, next) => {
    //This route gets the default chatroom for an event. If the chatroom doesn't exist it creates one
    const { roomId, chatEnabled, questionsEnabled } = req.body;

    try {
      const chatRoom = await ChatRoom.findByPk(roomId);
      chatRoom.chatEnabled = chatEnabled;
      chatRoom.questionsEnabled = questionsEnabled;
      await chatRoom.save();
      clearCache(`ChatRoom:id:${chatRoom.id}`);

      res.json(chatRoom);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
