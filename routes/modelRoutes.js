const express = require("express");
const { PageSection } = require("../db").models;

const router = express.Router();

router.get("/api/model/id", async (req, res, next) => {
  const { id } = req.query;
  try {
    const pageSections = await PageSection.findAll({
      where: { PageModelId: id },
      order: [["index", "ASC"]],
    });

    res.status(200).send(pageSections);
  } catch (error) {
    next(error);
  }
});

router.put("/api/model", async (req, res, next) => {
  const { model } = req.body;

  try {
    // first delete the old model
    await PageSection.destroy({
      where: { PageModelId: model[0].PageModelId },
    });

    // then write the newly updated model
    for (const [index, section] of model.entries()) {
      const pageSection = await PageSection.create({
        PageModelId: section.PageModelId,
        index,
        html: section.html,
        isReact: section.isReact,
        reactComponent: section.reactComponent,
      });
    }

    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
