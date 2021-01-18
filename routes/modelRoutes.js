const express = require("express");
const router = express.Router();

const db = require("../db");

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

router.put("/api/model", async (req, res) => {
  const { model } = req.body;

  // first delete the old model
  await db.query("DELETE FROM section_html WHERE model=$1", [model[0].model]);

  // then write the newly updated model
  for (const [index, section] of model.entries()) {
    await db.query(
      "INSERT INTO section_html (model, index, html, isReact, reactComponent) VALUES ($1,$2,$3,$4,$5)",
      [
        section.model,
        index,
        section.html,
        section.isReact,
        section.reactComponent,
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

module.exports = router;
