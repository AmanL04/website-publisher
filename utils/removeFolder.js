const rimraf = require("rimraf");

module.exports = function removeFolder(path) {
	return new Promise((resolve, reject) => {
		rimraf(path, (err) => {
			if (err) reject(err);
			else resolve();
		});
	});
};
