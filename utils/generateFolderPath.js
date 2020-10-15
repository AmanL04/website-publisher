const path = require("path");
const fs = require("fs");

module.exports = async function createDestinationFolderPath(subdomain, createFolder = true) {
	const folderPath = path.join(path.resolve(process.env.FILES_DIRECTORY), subdomain);
	console.log({ folderPath, createFolder });
	if (createFolder) {
		if (fs.existsSync(folderPath)) throw new Error("Domain already in use");
		await fs.promises.mkdir(folderPath, { recursive: true });
		return folderPath;
	}
	return folderPath;
};
