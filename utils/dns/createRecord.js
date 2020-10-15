const fetch = require("node-fetch");

module.exports = (type, name) =>
	fetch(`https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/dns_records`, {
		method: "POST",
		headers: {
			authorization: `Bearer ${process.env.CLOUDFLARE_AUTH_KEY}`,
			"content-type": "application/json",
		},
		body: JSON.stringify({ type, name, content: process.env.SERVER_IP, ttl: 120 }),
	}).then((res) => res.json());
