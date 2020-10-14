const path = require("path");
const fs = require("fs");

module.exports = async function createDestinationFolderPath(subdomain) {
	const folderPath = path.join(path.resolve(process.env.FILES_DIRECTORY), subdomain);
	console.log({ folderPath });
	if (fs.existsSync(folderPath)) {
		throw new Error("Domain already in use");
	} else {
		fs.mkdirSync(folderPath, { recursive: true });
		return folderPath;
	}
};
