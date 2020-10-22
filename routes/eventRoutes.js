const express = require("express");
const mongoose = require("mongoose");

const Event = mongoose.model("events");
const router = express.Router();

router.post("/api/events", async (req, res) => {
	const {
		title,
		link,
		category,
		startDate,
		endDate,
		timeZone,
		primaryColor,
	} = req.body;

	const event = new Event({
		title,
		link,
		category,
		startDate,
		endDate,
		timeZone,
		primaryColor,
	});

	event.save();
});

router.get("/api/events", async (req, res) => {});

module.exports = router;
