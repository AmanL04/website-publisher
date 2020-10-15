const mongoose = require("mongoose");

const Website = new mongoose.Schema({
	cloudflare_id: { type: String, required: true },
	username: { type: String, required: true },
	created_on: { type: Number, default: Date.now },
	url: { type: String, unique: true, required: true },
	active: { type: Boolean, default: true },
});

module.exports = mongoose.model(process.env.NODE_ENV === "production" ? "website" : "dev_websites", Website);
