const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema({
	id: Number,
	name: String,
	sectionHtml: String,
});

module.exports = modelSchema;
