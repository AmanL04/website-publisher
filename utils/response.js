const { model } = require("mongoose");

module.exports = function (success, details, message) {
	return { success, details, message };
};
