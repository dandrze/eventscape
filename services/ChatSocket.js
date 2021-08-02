var socketIo = require("socket.io");
const redisAdapter = require("./socketioRedisAdapter");

const {
  ChatRoom,
  ChatRoomCached,
  ChatUser,
  ChatMessage,
  ChatMessageCached,
  ChatQuestion,
  Account,
  Registration,
} = require("../db").models;
const logger = require("./winston");
const keys = require("../config/keys");
const { clearCache } = require("../services/sequelizeRedis");

module.exports = (server) => {
  const io = socketIo(server, {
    path: "/api/socket/chat",
    cors: {
      origin: [
        "http://test1.localhost:3000/",
        "http://app.localhost:3000/",
        "https://scaletest.emeryhill.com/",
        /\.emeryhill\.com$/,
      ],
      methods: ["GET", "POST"],
      credentials: true,
      transports: ["websocket", "polling"],
    },
    upgrade: true,
    pingTimeout: 30000,
    allowEIO3: true,
  });

  // Redis adapter for multi server
  io.adapter(redisAdapter);

  io.on("connection", function (socket) {
    socket.on(
      "join",
      async (
        { userId, registrationId, uuid, room, isModerator, isInitialConnect },
        callback
      ) => {
        // if it's not the initial connection, it's a reconnection
        // Everything else was already initialized, so just rejoin the room
        if (!isInitialConnect) {
          return socket.join(room.toString());
        }

        // Find all chat messages for a room. If there is a cached version of this query, then pull that instead
        const messageHistoryCacheKey = `ChatRoom:MessageHistory:${room}`;
        const [messageHistory, messageHistoryCacheHit] =
          await ChatMessageCached.findAllCached(messageHistoryCacheKey, {
            where: { ChatRoomId: room },
            order: [["id", "ASC"]],
            include: ChatUser,
          });

        var user;
        var created;

        // if the client passed a registrationId that means it's a registered guest, so fetch their info
        const registration = registrationId
          ? await Registration.findByPk(registrationId)
          : null;
        // if the client passed a userId taht means it's an eventscape user so fetch their info
        const account = userId ? await Account.findByPk(userId) : null;

        [user, created] = await ChatUser.findOrCreate({
          where: {
            //If it's an eventscape user, there will be an account, otherwise it is not an eventscape user
            AccountId: account ? account.id : null,
            //if it's a registered attendee, there will be a registration, otherwise it is not a registered attendee
            RegistrationId: registration ? registration.id : null,
            //if there is no accountId or RegistrationId then the client will pass us a uuid to idenfity the anonymous visitor
            uuid: uuid || null,
            ChatRoomId: room,
          },
        });

        // if it's an eventscape moderator, the name as already set in the chatroom endpoint upon load
        // for everyone else we need to set their name if it's a new user
        if (created && !account) {
          // if it's a registered attendee, use the attendee first name + last name as their name
          // if it's not a registered attendee then we'll create a guest name for them
          user.name = registration
            ? registration.firstName + " " + registration.lastName
            : "Guest" + user.id;

          user.save();
        }

        socket.join(room.toString());

        //push the message history
        socket.emit(
          "bulkMessage",
          messageHistory.map((message) => {
            return {
              user: message.ChatUser.name,
              text: message.text,
              id: message.id,
              deleted: message.deleted,
              userId: message.ChatUser.id,
            };
          })
        );

        if (isModerator) {
          const chatQuestions = await ChatQuestion.findAll({
            where: { ChatRoomId: room },
            include: { model: ChatUser, include: Registration },
          });

          chatQuestions.forEach((chatQuestion) => {
            socket.emit("question", {
              name: chatQuestion.ChatUser.name,
              text: chatQuestion.text,
              time: chatQuestion.createdAt,
              email: chatQuestion.ChatUser.Registration
                ? chatQuestion.ChatUser.Registration.emailAddress
                : null,
              id: chatQuestion.id,
              isChecked: chatQuestion.isChecked,
            });
          });
        }

        callback(user.id);
      }
    );

    socket.on("refreshChat", async ({ room }) => {
      io.to(room.toString()).emit("refresh");

      const messageHistory = await ChatMessage.findAll({
        where: { ChatRoomId: room },
        order: [["id", "ASC"]],
        include: ChatUser,
      });

      //push the message history
      io.to(room.toString()).emit(
        "bulkMessage",
        messageHistory.map((message) => {
          return {
            user: message.ChatUser.name,
            text: message.text,
            id: message.id,
            deleted: message.deleted,
            userId: message.ChatUser.id,
          };
        })
      );
    });

    socket.on("setQuestionChecked", async ({ id, isChecked }) => {
      await ChatQuestion.update({ isChecked }, { where: { id } });
    });

    socket.on(
      "sendMessage",
      async ({ chatUserId, room, message }, callback) => {
        const chatUser = await ChatUser.findOne({
          where: { id: chatUserId },
        });

        const chatMessage = await ChatMessage.create({
          ChatRoomId: room,
          text: message,
          ChatUserId: chatUserId,
        });

        // Now that there is a new message, the chatroom history cached value is no longer valid so clear it
        clearCache(`ChatRoom:MessageHistory:${room}`);

        io.to(room.toString()).emit("message", {
          room,
          user: chatUser.name,
          userId: chatUser.id,
          text: message,
          id: chatMessage.id,
        });

        callback();
      }
    );

    socket.on(
      "sendQuestion",
      async ({ chatUserId, room, question }, callback) => {
        const chatUser = await ChatUser.findByPk(chatUserId, {
          include: Registration,
        });

        const chatQuestion = await ChatQuestion.create({
          text: question,
          ChatUserId: chatUserId,
          ChatRoomId: room,
        });

        io.to(room.toString()).emit("question", {
          name: chatUser.name,
          text: chatQuestion.text,
          time: chatQuestion.createdAt,
          email: chatUser.Registration
            ? chatUser.Registration.emailAddress
            : null,
          id: chatQuestion.id,
          isChecked: chatQuestion.isChecked,
        });

        callback();
      }
    );

    socket.on("setChatHidden", async ({ chatHidden, room }) => {
      const chatRoom = await ChatRoom.findByPk(room);

      chatRoom.chatHidden = chatHidden;
      await chatRoom.save();
      clearCache(`ChatRoom:id:${chatRoom.id}`);

      io.to(room.toString()).emit("chatHidden", chatHidden);
    });

    socket.on("deleteMessage", async ({ id, room }) => {
      const chatMessage = await ChatMessage.findByPk(id);
      chatMessage.deleted = true;
      chatMessage.save();
      // the chatroom history cached value is no longer valid so clear it
      clearCache(`ChatRoom:MessageHistory:${room}`);

      io.to(room.toString()).emit("delete", id);
    });

    socket.on("restoreMessage", async ({ id, room }) => {
      const chatMessage = await ChatMessage.findByPk(id);
      chatMessage.deleted = false;
      chatMessage.save();

      // the chatroom history cached value is no longer valid so clear it
      clearCache(`ChatRoom:MessageHistory:${room}`);
      io.to(room.toString()).emit("restore", id);
    });

    socket.on("deleteAllMessages", async ({ room }) => {
      const chatMessage = await ChatMessage.update(
        { deleted: true },
        { where: { ChatRoomId: room } }
      );

      // the chatroom history cached value is no longer valid so clear it
      clearCache(`ChatRoom:MessageHistory:${room}`);

      io.to(room.toString()).emit("deleteAll");
    });

    socket.on("disconnect", (reason) => {});
  });
};
