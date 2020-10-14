module.exports = function to(potential_promise) {
	return potential_promise.then((res) => [null, res]).catch((err) => [err]);
};
