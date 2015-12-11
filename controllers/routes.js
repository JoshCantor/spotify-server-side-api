var request = require('request');

function routes(app) {
	app.get('/search', function(req, res) {
		res.render('../views/pages/search');
	});

	app.get('/artist', function(req, res) {
		res.render('../views/pages/artist');
	});

	app.post("/search", function (req, res) {
		var search = req.body.artistSearch.toString().split(' ').join('-');
		console.log(search);
    	request.get("https://api.spotify.com/v1/search?type=artist&q=" + search, function(error, response, body) {
	        if (error) {
	            res.status(500).send("You got an error - " + error);
	        } else if (!error && response.statCode >= 300) {
	            res.status(500).send("Something went wrong! Status: " + response.statusCode);
	        }
	        if (!error && response.statusCode === 200) {
	            var artists = JSON.parse(body);
	            console.log(artists);
	            // var result = "Artists" + artists. + "<br>";
	            // res.send(result);
	        }
	    });
	});
};

module.exports = routes;