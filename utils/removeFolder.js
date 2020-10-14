const fsp = require("fs").promises;

module.exports = function removeFolder(path) {
	return fsp.rmdir(path, { recursive: true });
};
