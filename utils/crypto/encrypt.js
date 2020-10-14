const crypto = require("crypto");

/**
 * @param text text
 * @param key text
 * @description Encrypt the text with the given key using the aes-256-cbc algorithm
 * @returns string
 */

module.exports = function encrypt(text, key) {
	let iv = crypto.randomBytes(16);
	let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
	let encrypted = cipher.update(text);

	encrypted = Buffer.concat([encrypted, cipher.final()]);

	return iv.toString("hex") + ":" + encrypted.toString("hex");
};
