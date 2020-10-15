const fetch = require("node-fetch");

module.exports = (id) =>
	fetch(`https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/dns_records/${id}`, {
		method: "DELETE",
		headers: {
			authorization: `Bearer ${process.env.CLOUDFLARE_AUTH_KEY}`,
			"content-type": "application/json",
		},
	}).then((res) => res.json());
