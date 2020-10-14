const User = require("../models/user");

const to = require("../utils/to");
const response = require("../utils/response");

module.exports = async function signIn(req, res) {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(401).json(response(false, null, "Invalid username and password combination!"));
	}

	console.log(req.body);

	const [err, user] = await to(User.findOne({ username }));
	if (err) {
		console.log(new Date(Date.now()), ": ", err);
		return res.status(401).json(response(false, null, "Couldn't authenticate. Something went wrong!"));
	}
	if (!user || !user.validatePassword(password)) {
		return res.status(401).json(response(false, null, "Invalid username and password combination!"));
	}

	return res.json(response(true, user.createKeys(), "Successful Login!"));
};
