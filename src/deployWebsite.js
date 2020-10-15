const admZip = require("adm-zip");

const to = require("../utils/to");
const response = require("../utils/response");
const randomWord = require("../utils/randomWord");
const removeFolder = require("../utils/removeFolder");
const folderPath = require("../utils/generateFolderPath");

const createDNSRecord = require("../utils/dns/createRecord");
const removeDNSRecord = require("../utils/dns/removeRecord");

const Website = require("../models/websites");

module.exports = async function (req, res) {
	console.log(req.file, req.body);
	if (typeof req.file != "object" || req.file.mimetype !== "application/zip") {
		console.log("File should be a zip file");
		return res.status(415).json(response(false, null, "Unsupported media type"));
	}

	// Create a parsable zip in-memory and check if it contains index.html
	const zip = new admZip(req.file.buffer);
	if (!zip.getEntries().some((entry) => entry.entryName == "index.html")) {
		return res.status(400).json(response(false, null, "index.html file does not exist"));
	}

	// Determine the subdomain
	const subdomain = (req.body.subdomain || randomWord()) + "." + process.env.DOMAIN;
	console.log(subdomain);

	// Unzip the uploaded zip in the appropriate location
	const [folderCreationError, folder] = await to(folderPath(subdomain));
	if (folderCreationError) {
		return res.json(response(false, null, folderCreationError.message || "Something went wrong"));
	}
	zip.extractAllTo(folder, true);

	// Create a subdomain DNS record in the cloudflare dashboard
	const [DNSRecordError, newSubdomain] = await to(createDNSRecord("A", subdomain));

	console.log(new Date(Date.now()), ": ", newSubdomain);

	if (DNSRecordError || typeof newSubdomain != "object" || !newSubdomain.success) {
		console.log(new Date(Date.now()), ": ", DNSRecordError);
		await to(removeFolder(folder));
		if (typeof newSubdomain == "object")
			return res.json(response(false, null, newSubdomain.errors.map((err) => err.message).join(", ")));
		return res.json(response(false, null, "Something went wrong"));
	}

	// Save the website for the current user
	const [saveWebsiteError] = await to(
		Website.create({ username: req.user.username, url: subdomain, cloudflare_id: newSubdomain.result.id })
	);
	if (saveWebsiteError) {
		console.log(new Date(Date.now()), ": ", saveWebsiteError);
		await to(removeFolder(folder));
		await to(removeDNSRecord(newSubdomain.result.id));
		if (saveWebsiteError.code === 11000 && saveWebsiteError.errmsg.indexOf("url_1 dup key") !== -1) {
			return res.json(response(false, null, "Domain is already in use"));
		}
		return res.json(response(false, null, "Something went wrong"));
	}

	return res.json(response(true, newSubdomain.result.name, "Successfully deployed!"));
};
