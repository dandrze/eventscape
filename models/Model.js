const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema({
	name: String,
	sectionHtml: String,
});

module.exports = modelSchema;
