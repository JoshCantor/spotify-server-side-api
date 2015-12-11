function routes(app) {
	app.get('/search', function(req, res) {
		res.render('../views/pages/search');
	});

	app.get('/artist', function(req, res) {
		res.render('../views/pages/artist');
	});
};

module.exports = routes;