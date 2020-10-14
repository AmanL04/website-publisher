require("dotenv").config();
require("./db");

const express = require("express");
const app = express();
const routes = require("./routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
	console.log(req.params);
	console.log(req.body);
	console.log(req.query);
	console.log(req.file);
	console.log(req.headers);
	console.log(req.method);
	console.log(req.path);
	next();
});

routes(app);

app.get("*", (_, res) => res.status(404).send());

const listener = app.listen(process.env.PORT || 9999, function () {
	console.log("Your app is listening on port " + listener.address().port);
});
