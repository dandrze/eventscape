const express = require("express");
const { PageSection, PageSectionCached, PageModel, PageModelCached } =
  require("../db").models;
const { clearCache } = require("../services/sequelizeRedis");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

// publicly accessible route
router.get("/api/model/id", async (req, res, next) => {
  const { id } = req.query;
  try {
    const pageSectionCacheKey = `PageSection:PageModelId:${id}`;

    const [sections, sectionsCacheHit] = await PageSectionCached.findAllCached(
      pageSectionCacheKey,
      {
        where: { PageModelId: id },
        order: [["index", "ASC"]],
      }
    );

    // If anything goes wrong with the database call and returns an empty array, clear the empty array from the cache
    if (sections.length === 0) clearCache(pageSectionCacheKey);

    const pageModelCacheKey = `PageModel:PageModelId:${id}`;
    const [pageModel, pageModelCacheHit] = await PageModelCached.findByPkCached(
      pageModelCacheKey,
      id
    );

    if (pageModel) {
      const { backgroundColor, backgroundImage, backgroundBlur } = pageModel;

      res.json({
        id,
        sections,
        backgroundColor,
        backgroundImage,
        backgroundBlur,
      });
    } else {
      // if a page model is not found or there is an error, clear the cache (don't cache the empty model), and return an error
      clearCache(pageModelCacheKey);
      next({ statusCode: 500, message: "page model not found" });
    }
  } catch (error) {
    next(error);
  }
});

// publicly accessible route
// used to test performance
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
    clearCache(`PageModel:PageModelId:${model.id}`);

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
