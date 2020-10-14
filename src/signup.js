const User = require("../models/user");

const to = require("../utils/to");
const response = require("../utils/response");

module.exports = async function signUp(req, res) {
	const { username, password, fullname } = req.body;

	if (!username || !password || !fullname) {
		return res.status(401).json(response(false, null, "Please provide all required fields"));
	}

	const user = new User({ username, fullname });
	user.setPassword(password);

	const [err] = await to(user.save());
	if (err) {
		if (err.code === 11000 && err.errmsg.indexOf("username_1 dup key") !== -1) {
			return res.json(response(false, null, "User with this username already exists"));
		}
		console.log(new Date(Date.now()), ": ", err);
		return res.json(response(false, null, "Couldn't create user. Something went wrong"));
	}

	return res.json(response(true, user.createKeys(), "Successfully created user"));
};
