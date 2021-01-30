var socketIo = require("socket.io");
const {
  ChatRoom,
  ChatUser,
  ChatMessage,
  ChatQuestion,
  Account,
  Registration,
} = require("../db").models;

module.exports = (server) => {
  const io = socketIo(server, {
    path: "/api/socket/chat",
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on(
      "join",
      async ({ userId, registrationId, uuid, room, isModerator }, callback) => {
        const chatRoom = await ChatRoom.findByPk(room);

        const messageHistory = await ChatMessage.findAll({
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

        socket.join(room);
        // push the hidden state (true or false)
        if (chatRoom) socket.emit("chatHidden", chatRoom.chatHidden);

        socket.emit("notification", {
          text: "You are now connected to room " + room,
        });

        //push the message history
        messageHistory.forEach((message) => {
          socket.emit("message", {
            user: message.ChatUser.name,
            text: message.text,
            id: message.id,
            deleted: message.deleted,
            userId: message.ChatUser.id,
          });
        });

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
      io.to(room).emit("refresh");

      const messageHistory = await ChatMessage.findAll({
        where: { ChatRoomId: room },
        order: [["id", "ASC"]],
        include: ChatUser,
      });

      io.to(room).emit("notification", {
        text: "You are now connected to room " + room,
      });

      //push the message history
      messageHistory.forEach((message) => {
        io.to(room).emit("message", {
          user: message.ChatUser.name,
          text: message.text,
          id: message.id,
          deleted: message.deleted,
          userId: message.ChatUser.id,
        });
      });
    });

    socket.on("setQuestionChecked", async ({ id, isChecked }) => {
      await ChatQuestion.update({ isChecked }, { where: { id } });
    });

    socket.on(
      "sendMessage",
      async ({ chatUserId, room, message }, callback) => {
        const chatUser = await ChatUser.findOne({ where: { id: chatUserId } });

        const chatMessage = await ChatMessage.create({
          ChatRoomId: room,
          text: message,
          ChatUserId: chatUserId,
        });

        io.to(room).emit("message", {
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

        io.to(room).emit("question", {
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

      io.to(room).emit("chatHidden", chatHidden);
    });

    socket.on("deleteMessage", async ({ id, room }) => {
      const chatMessage = await ChatMessage.findByPk(id);
      chatMessage.deleted = true;
      chatMessage.save();

      io.to(room).emit("delete", id);
    });

    socket.on("restoreMessage", async ({ id, room }) => {
      const chatMessage = await ChatMessage.findByPk(id);
      chatMessage.deleted = false;
      chatMessage.save();
      io.to(room).emit("restore", id);
    });

    socket.on("deleteAllMessages", async ({ room }) => {
      const chatMessage = await ChatMessage.update(
        { deleted: true },
        { where: { ChatRoomId: room } }
      );

      io.to(room).emit("deleteAll");
    });

    socket.on("disconnect", (reason) => {
      console.log("Client disconnected: " + reason);
    });
  });
};
