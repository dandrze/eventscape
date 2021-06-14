const express = require("express");
const router = express.Router();

const requireAuth = require("../middlewares/requireAuth");

const { Package, PackageType, Event, Account } = require("../db").models;
const { Op } = require("sequelize");

router.get("/api/admin/data", requireAuth, async (req, res, next) => {
  if (req.user.type === "admin") {
    try {
      const events = await Event.findAll({
        include: [
          { model: Account, as: "Owner" },
          { model: Package, include: PackageType },
        ],
      });

      res.json(events);
    } catch (error) {
      next(error);
    }
  } else {
    res.status(401).send();
  }
});

module.exports = router;
