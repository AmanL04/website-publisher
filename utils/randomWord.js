const randomWords = require("random-words");
const options = [undefined, { exactly: 2, join: "-", maxLength: 6 }, { exactly: 3, join: "-", maxLength: 4 }];

module.exports = function () {
	const random = Math.floor(Math.random() * 3);
	console.log(random);
	return randomWords(options[random]);
};
