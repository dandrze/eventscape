const express = require("express");
const { PageSection, PageSectionCached, PageModel } = require("../db").models;
const { clearCache } = require("../services/sequelizeRedis");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

// publicly accessible route
router.get("/api/model/id", async (req, res, next) => {
  const { id } = req.query;
  try {
    const pageSectionCacheKey = `PageSection:PageModelId:${id}`;
    const [sections, sectionCacheHit] = await PageSectionCached.findAllCached(
      pageSectionCacheKey,
      {
        where: { PageModelId: id },
        order: [["index", "ASC"]],
      }
    );

    const {
      backgroundColor,
      backgroundImage,
      backgroundBlur,
    } = await PageModel.findByPk(id);

    console.log(backgroundBlur);

    res.json({
      id,
      sections,
      backgroundColor,
      backgroundImage,
      backgroundBlur,
    });
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

    res.json(pageSections);
  } catch (error) {
    next(error);
  }
});

router.put("/api/model", requireAuth, async (req, res, next) => {
  const { model } = req.body;

  try {
    // clear the cache
    clearCache(`PageSection:PageModelId:${model.id}`);

    // fetch model from database
    const pageModel = await PageModel.findByPk(model.id);

    // update the background values
    pageModel.backgroundColor = model.backgroundColor;
    pageModel.backgroundImage = model.backgroundImage;
    pageModel.backgroundBlur = model.backgroundBlur;
    await pageModel.save();

    //  delete the old model
    await PageSection.destroy({
      where: { PageModelId: model.id },
    });

    // then write the newly updated model
    for (const [index, section] of model.sections.entries()) {
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
