const mongoose = require("mongoose");

const Website = new mongoose.Schema({
	username: { type: String, unique: true, required: true },
	created_on: { type: Number, default: Date.now },
	url: { type: String, required: true },
	active: { type: Boolean, default: true },
});

module.exports = mongoose.model("website", Website);
