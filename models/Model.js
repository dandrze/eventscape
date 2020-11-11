const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema({
	id: Number,
	name: String,
	html: String,
});

module.exports = modelSchema;
