const crypto = require("crypto");

/**
 * @param text text
 * @param key text
 * @description Decrypt the text using the given key using the aes-256-cbc algorithm
 * @returns string
 */

module.exports = function decrypt(text, key) {
	let textParts = text.split(":");
	let iv = Buffer.from(textParts.shift(), "hex");
	let encryptedText = Buffer.from(textParts.join(":"), "hex");
	let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
	let decrypted = decipher.update(encryptedText);

	decrypted = Buffer.concat([decrypted, decipher.final()]);

	return decrypted.toString();
};
