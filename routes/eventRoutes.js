const express = require("express");
const router = express.Router();

const db = require("../db");
const requireAuth = require("../middlewares/requireAuth");

const conn = require("../sequelize").conn;
const { ChatRoom, ChatUser } = require("../sequelize").models;
const { recipientsOptions, statusOptions } = require("../model/enums");

router.post("/api/event", async (req, res) => {
  const {
    event: {
      title,
      link,
      category,
      start_date,
      end_date,
      time_zone,
      primary_color,
      reg_page_model,
      event_page_model,
    },
    emails,
  } = req.body;

  const userId = req.user.id;

  // set all other events is_current to false so we can make our new event current
  await db.query(
    `UPDATE event 
		SET is_current = false
		WHERE user_id = $1`,
    [userId],
    (err, res) => {
      if (err) {
        throw res.status(500).send(err);
      }
    }
  );

  // Store a new model in the model table for the registration page
  const pgRegModel = await db.query(
    `INSERT INTO model 
				(type)
			VALUES ($1)
			RETURNING id`,
    ["model"],
    (err, res) => {
      if (err) {
        throw res.status(500).send(Error);
      }
    }
  );

  // Store a new model in the model table for the event page
  const pgEventModel = await db.query(
    `INSERT INTO model 
				(type)
			VALUES ($1)
			RETURNING id`,
    ["model"],
    (err, res) => {
      if (err) {
        throw res.status(500).send(Error);
      }
    }
  );

  // add the event to the event table. Make it the current event
  const newEvent = await db.query(
    `INSERT INTO event 
			(title, link, category, start_date, end_date, time_zone, primary_color, is_current, user_id, reg_page_model, event_page_model) 
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		RETURNING *`,
    [
      title,
      link,
      category,
      start_date,
      end_date,
      time_zone,
      primary_color,
      true,
      userId,
      pgRegModel.rows[0].id,
      pgEventModel.rows[0].id,
    ],
    (err, res) => {
      if (err) {
        throw res.status(500).send(Error);
      }
    }
  );

  // create a default chatroom
  const newRoom = await ChatRoom.create({
    event: newEvent.rows[0].id,
    isDefault: true,
    name: "Main Chat (Default)",
  });

  // Store the section HTML for the reg page model
  for (i = 0; i < reg_page_model.length; i++) {
    if (
      reg_page_model[i].is_react &&
      reg_page_model[i].react_component.name == "StreamChat"
    ) {
      reg_page_model[i].react_component.props.chatRoom = newRoom.id;
    }

    console.log(reg_page_model[i].react_component);

    await db.query(
      `INSERT INTO section_html
					(model, index, html, is_react, react_component)
					VALUES
					($1, $2, $3, $4, $5)`,
      [
        pgRegModel.rows[0].id,
        i,
        reg_page_model[i].html,
        reg_page_model[i].is_react,
        reg_page_model[i].react_component,
      ]
    );
  }

  // Store the section HTML for the event page model
  for (i = 0; i < event_page_model.length; i++) {
    if (
      event_page_model[i].is_react &&
      event_page_model[i].react_component.name == "StreamChat"
    ) {
      event_page_model[i].react_component.props.chatRoom = newRoom.id;
    }

    await db.query(
      `INSERT INTO section_html
					(model, index, html, is_react, react_component)
					VALUES
					($1, $2, $3, $4, $5)`,
      [
        pgEventModel.rows[0].id,
        i,
        event_page_model[i].html,
        event_page_model[i].is_react,
        event_page_model[i].react_component,
      ]
    );
  }

  // add the emails for this event
  for (var email of emails) {
    await db.query(
      `INSERT INTO email 
			(subject, recipients, minutes_from_event, html, event, status) 
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING *`,
      [
        email.subject,
        email.recipients,
        email.minutes_from_event,
        email.html,
        newEvent.rows[0].id,
        email.status,
      ],
      (err, res) => {
        if (err) {
          throw res.status(500).send(Error);
        }
      }
    );
  }

  res.status(200).send(newEvent.rows[0]);
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
  const events = await db.query(
    "SELECT * FROM event WHERE link=$1",
    [link],
    (err, res) => {
      if (err) {
        throw res.status(500).send(err);
      }
    }
  );

  res.send(events.rows[0]);
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
    start_date,
    end_date,
    time_zone,
    primary_color,
    status,
  } = req.body;

  const events = await db.query(
    `UPDATE event 
		SET 
		  title = $1, 
		  link = $2, 
		  category = $3,
		  start_date = $4,
		  end_date = $5, 
		  time_zone = $6,
		  primary_color = $7,
		  status = $8
		WHERE 
		  user_id=$9 AND is_current=true
		RETURNING *`,
    [
      title,
      link,
      category,
      start_date,
      end_date,
      time_zone,
      primary_color,
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

router.put("/api/event/chatuser", async (req, res) => {
  const { userId, name } = req.body;
  console.log(userId, name);

  try {
    const [dbUser, created] = await ChatUser.findOrCreate({
      where: {
        EventscapeId: userId,
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

module.exports = router;
