const crypto = require("crypto");

/**
 * @param length number
 * @description Generate a random key good enough to be used as salt for password hashing
 * @returns string
 */
module.exports = function randomKey(length) {
	return crypto
		.randomBytes(Math.ceil((length || 32) / 2))
		.toString("hex") /** convert to hexadecimal format */
		.slice(0, 32);
};
