const crypto = require("crypto");

/**
 * @param password text
 * @param salt text
 * @description Create a HMAC using SHA-512 algorithm with the password and salt
 * @returns string
 */
module.exports = (password, salt) => crypto.createHmac("sha512", salt).update(password).digest("hex");
