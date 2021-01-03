const express = require("express");
const router = express.Router();

const db = require("../db");

const conn = require("../sequelize").conn;
const { ChatRoom } = require("../sequelize").models;

router.get("/api/model/id", async (req, res) => {
  const id = req.query.id;
  const sectionList = await db.query(
    "SELECT * FROM section_html WHERE model=$1 ORDER BY index ASC",
    [id],
    (err, res) => {
      if (err) {
        throw res.status(500).send(err);
      }
    }
  );

  res.send(sectionList.rows);
});

router.get("/api/model/link", async (req, res) => {
  const link = req.query.link;

  const event = await db.query(
    "SELECT reg_page_model FROM event WHERE link=$1 AND status!= 'deleted'",
    [link],
    (err, res) => {
      if (err) {
        throw res.status(500).send(err);
      }
    }
  );

  if (event.rowCount == 0) {
    res.send([]);
  } else {
    const sectionList = await db.query(
      "SELECT * FROM section_html WHERE model=$1 ORDER BY index ASC",
      [event.rows[0].reg_page_model],
      (err, res) => {
        if (err) {
          throw res.status(500).send(err);
        }
      }
    );

    res.status(200).send(sectionList.rows);
  }
});

router.put("/api/model", async (req, res) => {
  const { model } = req.body;

  // first delete the old model
  await db.query("DELETE FROM section_html WHERE model=$1", [model[0].model]);

  // then write the newly updated model
  for (const [index, section] of model.entries()) {
    await db.query(
      "INSERT INTO section_html (model, index, html, is_react, react_component) VALUES ($1,$2,$3,$4,$5)",
      [
        section.model,
        index,
        section.html,
        section.is_react,
        section.react_component,
      ],
      (err, res) => {
        if (err) {
          throw res.status(500).send(err);
        }
      }
    );
  }

  res.status(200).send();
});

router.post("/api/model/chat", async (req, res) => {
  const { eventId } = req.body;

  const newRoom = await ChatRoom.create({ event: eventId });

  console.log(newRoom);

  res.status(200).send({ id: newRoom.id });
});

module.exports = router;
