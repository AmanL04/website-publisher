const Website = require("../models/websites");
const to = require("../utils/to");
const response = require("../utils/response");

module.exports = async function listWebsites(req, res) {
	const [err, websites] = await to(Website.find({ username: req.username }));
	if (err) {
		console.log(new Date(Date.now()), ": ", err);
		return res.status(500).json(response(false, null, "Something went wrong"));
	}
	return res.json(
		response(true, !websites || websites.length == 0 ? [] : websites, "All the deployed websites")
	);
};
