function routes(app) {
	app.get('/search', function(req, res) {
		res.render('../views/pages/search');
	});
};

module.exports = routes;