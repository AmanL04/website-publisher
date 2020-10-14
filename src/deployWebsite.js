const admZip = require("adm-zip");
const fetch = require("node-fetch");

const to = require("../utils/to");
const response = require("../utils/response");
const randomWord = require("../utils/randomWord");
const removeFolder = require("../utils/removeFolder");
const folderPath = require("../utils/generateFolderPath");

const Website = require("../models/websites");

module.exports = async function (req, res) {
	console.log(req.file, req.body);
	if (req.file.mimetype !== "application/zip") {
		console.log("File should be a zip file");
		return res.status(415).json(response(false, null, "Unsupported media type"));
	}

	// Create a parsable zip in-memory and check if it contains index.html
	const zip = new admZip(req.file.buffer);
	if (!zip.getEntries().some((entry) => entry.entryName == "index.html")) {
		return res.status(400).json(response(false, null, "index.html file does not exist"));
	}

	// Determine the subdomain and unzip the uploaded zip in the appropriate location
	const subdomain = (req.body.subdomain || randomWord()) + "." + process.env.DOMAIN;
	console.log(subdomain);
	var folder;
	try {
		folder = await folderPath(subdomain);
	} catch (err) {
		return res.json(response(false, null, err.message || "Something went wrong"));
	}
	zip.extractAllTo(folder, true);

	// Save the website for the current user
	const [saveWebsiteError, website] = await to(
		new Website({ username: req.user.username, url: subdomain }).save()
	);
	if (saveWebsiteError) {
		console.log(new Date(Date.now()), ": ", saveWebsiteError);
		await to(removeFolder(folder));
		if (saveWebsiteError.code === 11000 && saveWebsiteError.errmsg.indexOf("url_1 dup key") !== -1) {
			return res.json(response(false, null, "Domain is already in use"));
		}
		return res.json(response(false, null, "Something went wrong"));
	}
	// Create a subdomain DNS record in the cloudflare dashboard
	const [DNSRecordError, newSubdomain] = await to(
		fetch(`https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/dns_records`, {
			method: "POST",
			headers: {
				authorization: `Bearer ${process.env.CLOUDFLARE_AUTH_KEY}`,
				"content-type": "application/json",
			},
			body: JSON.stringify({
				type: "A",
				name: website.url,
				content: process.env.SERVER_IP,
				ttl: 120,
			}),
		}).then((res) => res.json())
	);

	console.log(DNSRecordError, newSubdomain);

	if (DNSRecordError || typeof newSubdomain != "object" || !newSubdomain.success) {
		console.log(new Date(Date.now()), ": ", DNSRecordError);
		await to(removeFolder(folder));
		await to(website.remove());
		if (typeof newSubdomain == "object")
			return res.json(response(false, null, newSubdomain.errors.map((err) => err.message).join(", ")));
		return res.json(response(false, null, "Something went wrong"));
	}

	return res.json(response(true, newSubdomain.result.name, "Successfully deployed!"));
};
