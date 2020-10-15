const multer = require("multer");
const response = require("../utils/response");
const storage = multer.memoryStorage();

module.exports = function (router) {
	router.post("/v1/auth/signin", require("../src/signin"));
	router.put("/v1/auth/signup", require("../src/signup"));
	router.use(require("../middleware/authenticate"));
	router.get("/v1/user", require("../src/getUser"));
	router.get("/v1/website/list", require("../src/listWebsites"));
	router.put(
		"/v1/website/deploy",
		multer({ storage: storage }).single("website"),
		require("../src/deployWebsite")
	);
	router.put("/v1/website/undeploy", require("../src/undeployWebsite"));
	// router.put("/v1/website/deactivate",require("../src/deactivateWebsite"));
};
