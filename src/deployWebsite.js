const to = require("../utils/to");
const response = require("../utils/response");

module.exports = async function (req, res) {
	console.log(req.file);
	return res.json(response(true, "url", "Successfully deployed!"));
};
