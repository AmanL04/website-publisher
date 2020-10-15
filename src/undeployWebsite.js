const to = require("../utils/to");
const response = require("../utils/response");
const removeFolder = require("../utils/removeFolder");

const createDNSRecord = require("../utils/dns/createRecord");
const removeDNSRecord = require("../utils/dns/removeRecord");
const folderPath = require("../utils/generateFolderPath");

const Website = require("../models/websites");

module.exports = async function (req, res) {
	console.log(req.body);
	if (!req.body.url) return res.status(400).json(response(false, null, "Please provide all required fields"));

	// Delete the website document from DB
	const [deleteDocError, website] = await to(
		Website.findOneAndDelete({ username: req.user.username, url: req.body.url }).lean()
	);
	if (deleteDocError) {
		console.log(deleteDocError);
		return res.status(500).json(response(false, null, "Something went wrong"));
	}
	if (!website) return res.status(400).json(response(false, null, "No such website exists"));

	// Delete a subdomain DNS record in the cloudflare dashboard
	const [DNSRecordError, DNSRecord] = await to(removeDNSRecord(website.cloudflare_id));

	if (DNSRecordError || typeof DNSRecord != "object" || !DNSRecord.success) {
		console.log(new Date(Date.now()), ": ", DNSRecordError);
		await to(Website.create(website));
		if (typeof DNSRecord == "object")
			return res.json(response(false, null, DNSRecord.errors.map((err) => err.message).join(", ")));
		return res.json(response(false, null, "Something went wrong"));
	}

	// Delete the folder
	const [folderPathErr, folder] = await to(folderPath(website.url, false));
	if (folderPathErr) {
		console.log(new Date(Date.now()), ": ", folderPathErr);
		const [createRecordErr, record] = await to(createDNSRecord("A", website.url));
		if (!createRecordErr && typeof record == "object" && record.success) {
			website.cloudflare_id = record.result.id;
			await to(Website.create(website));
		}
		return res.status(500).json(response(false, null, "Something went wrong"));
	}
	const [removeFolderErr] = await to(removeFolder(folder));
	if (removeFolderErr) {
		console.log(new Date(Date.now()), ": ", removeFolderErr);
		const [createRecordErr, record] = await to(createDNSRecord("A", website.url));
		if (!createRecordErr && typeof record == "object" && record.success) {
			website.cloudflare_id = record.result.id;
			await to(Website.create(website));
		}
		return res.status(500).json(response(false, null, "Something went wrong"));
	}

	return res.json(response(true, null, "Successfully undeployed!"));
};
