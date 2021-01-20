const express = require("express");
const { PageSection } = require("../db").models;

const router = express.Router();

router.get("/api/model/id", async (req, res, next) => {
  const { id } = req.query;
  const pageSections = await PageSection.findAll({
    where: { PageModelId: id },
    order: [["index", "ASC"]],
  }).catch(next);

  res.status(200).send(pageSections);
});

router.put("/api/model", async (req, res, next) => {
  const { model } = req.body;

  // first delete the old model
  await PageSection.destroy({
    where: { PageModelId: model[0].PageModelId },
  }).catch(next);

  // then write the newly updated model
  for (const [index, section] of model.entries()) {
    await PageSection.create({
      PageModelId: section.PageModelId,
      index,
      html: section.html,
      isReact: section.isReact,
      reactComponent: section.reactComponent,
    }).catch(next);
  }

  res.status(200).send();
});

module.exports = router;
