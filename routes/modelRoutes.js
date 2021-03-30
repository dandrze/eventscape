const express = require("express");
const { PageSection, PageSectionCached } = require("../db").models;
const { clearCache } = require("../services/sequelizeRedis");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

// publicly accessible route
router.get("/api/model/id", async (req, res, next) => {
  const { id } = req.query;
  try {
    const pageSectionCacheKey = `PageSection:PageModelId:${id}`;
    const [
      pageSections,
      pageSectionCacheHit,
    ] = await PageSectionCached.findAllCached(pageSectionCacheKey, {
      where: { PageModelId: id },
      order: [["index", "ASC"]],
    });

    res.json(pageSections);
  } catch (error) {
    next(error);
  }
});

// publicly accessible route
router.get("/api/model/id/uncached", async (req, res, next) => {
  const { id } = req.query;
  try {
    const pageSections = await PageSection.findAll({
      where: { PageModelId: id },
      order: [["index", "ASC"]],
    });

    console.log(pageSections);

    res.json(pageSections);
  } catch (error) {
    next(error);
  }
});

router.put("/api/model", requireAuth, async (req, res, next) => {
  const { model } = req.body;
  const PageModelId = model[0].PageModelId;

  try {
    // clear the cache
    console.log(PageModelId);
    clearCache(`PageSection:PageModelId:${PageModelId}`);
    //  delete the old model
    await PageSection.destroy({
      where: { PageModelId },
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

    res.json();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
