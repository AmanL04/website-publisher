const response = require("../utils/response");

module.exports = async function getUser(req, res) {
	req.user = req.user.toObject();
	delete req.user.password;
	delete req.user.salt;
	return res.json(response(true, req.user, "Signed in user data"));
};
