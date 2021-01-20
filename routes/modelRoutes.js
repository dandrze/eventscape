const express = require("express");
const { PageSection } = require("../db").models;

const router = express.Router();

router.get("/api/model/id", async (req, res) => {
  const { id } = req.query;
  const pageSections = await PageSection.findAll({
    where: { PageModelId: id },
    order: [["index", "ASC"]],
  });

  res.status(200).send(pageSections);
});

router.put("/api/model", async (req, res) => {
  const { model } = req.body;

  // first delete the old model
  await PageSection.destroy({ where: { PageModelId: model[0].PageModelId } });

  // then write the newly updated model
  for (const [index, section] of model.entries()) {
    await PageSection.create({
      PageModelId: section.PageModelId,
      index,
      html: section.html,
      isReact: section.isReact,
      reactComponent: section.reactComponent,
    });
  }

  res.status(200).send();
});

module.exports = router;
