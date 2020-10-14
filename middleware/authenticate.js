const to = require("../utils/to");
const response = require("../utils/response");
const decrypt = require("../utils/crypto/decrypt");

const User = require("../models/user");

module.exports = async function authenticate(req, res, next) {
	const key1 = req.headers["x-api-key1"];
	const key2 = req.headers["x-api-key2"];
	const username = req.headers["x-api-username"];

	if (!key1 || !key2 || !username) {
		return res.status(401).json(response(false, null, "User not authenticated!"));
	}

	const [err, user] = await to(User.findOne({ username }));
	if (err) {
		console.log(new Date(Date.now()), ": ", err);
		return res.status(401).json(response(false, null, "Couldn't authenticate. Something went wrong!"));
	}
	if (!user) {
		return res.status(401).json(response(false, null, "User not authenticated!"));
	}

	const firstDecryption = decrypt(key2, user.salt);
	const [id, deadline] = decrypt(firstDecryption, key1).split(":");
	if (user._id.toString() != id) {
		return res.status(401).json(response(false, null, "User not authenticated!"));
	}
	if (deadline < Date.now()) {
		return res.status(401).json(response(false, null, "Authentication keys have expired"));
	}

	req.user = user;
	next();
};
