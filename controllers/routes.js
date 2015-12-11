function routes(app) {
	app.get('/search', function(req, res) {
		res.render('../views/pages/search');
	});

	app.get('/artist', function(req, res) {
		res.render('../views/pages/artist');
	});

	app.post("/search", function (req, res) {
		var search = req.body.artistSearch.toString();
		console.log(search);
    	// request.get('http://www.omdbapi.com/?i=tt4331680', function(error, response, body) {
     //    if (error) {
     //        res.status(500).send("You got an error - " + error);
     //    } else if (!error && response.statCode >= 300) {
     //        res.status(500).send("Something went wrong! Status: " + response.statusCode);
     //    }
     //    if (!error && response.statusCode === 200) {
     //        var movieData = JSON.parse(body);
     //        var result = "Title: " + movieData.Title + "<br>" + "Year: " + movieData.Year + "<br>";
     //        res.send(result);
     //    }
	});
};

module.exports = routes;