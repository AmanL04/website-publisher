const multer = require("multer");
const response = require("../utils/response");
const storage = multer.memoryStorage();

module.exports = function (router) {
	router.post("/v1/auth/signin", require("../src/signin"));
	router.put("/v1/auth/signup", require("../src/signup"));
	router.use(require("../middleware/authenticate"));
	router.get("/v1/website/list", require("../src/listWebsites"));
	router.put(
		"/v1/website/deploy",
		multer({ storage: storage }).single("website"),
		require("../src/deployWebsite")
	);
	// router.put("/v1/website/deploy", multer({ storage: storage }), require("../src/deployWebsite"));
	// router.put("/v1/website/undeploy", require("../middleware/upload"), require("../src/undeployWebsite"));
	// router.put("/v1/website/remove", require("../middleware/upload"), require("../src/undeployWebsite"));
};
