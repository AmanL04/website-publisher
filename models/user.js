const mongoose = require("mongoose");
const encrypt = require("../utils/crypto/encrypt");
const sha512 = require("../utils/crypto/sha512");
const randomKey = require("../utils/crypto/randomKey");

const User = new mongoose.Schema({
	username: { type: String, unique: true, required: true, lowercase: true },
	fullname: { type: String, required: true },
	password: { type: String, required: true },
	salt: { type: String },
});

User.methods.setPassword = function (password) {
	this.salt = randomKey();
	this.password = sha512(password, this.salt);
};

User.methods.validatePassword = function (password) {
	const givenPasswordHash = sha512(password, this.salt);
	return givenPasswordHash === this.password;
};

User.methods.createKeys = function () {
	const oneHour = 60 * 60 * 1000;
	const key = randomKey();
	const text = this._id.toString() + ":" + (Date.now() + oneHour);
	const firstEncryption = encrypt(text, key);
	const secondEncryption = encrypt(firstEncryption, this.salt);
	return { key1: key, key2: secondEncryption };
};

module.exports = mongoose.model("user", User);
