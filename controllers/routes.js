var request = require('request');
var prettyJson = require('prettyjson');

function routes(app) {
	app.get('/search', function(req, res) {
		res.render('../views/pages/search');
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
	            var artists = JSON.parse(body).artists.items;
	            res.render('../views/pages/results', {
	            	artists: artists
	            });
	        }
	    });
	});

	app.get('/:artist/:artistId', function(req, res) {
		var artist = req.params.artist;
		var artistId = req.params.artistId;
		request.get("https://api.spotify.com/v1/artists/" + artistId + '/albums', function(error, response, body) {
	        if (error) {
	            res.status(500).send("You got an error - " + error);
	        } else if (!error && response.statCode >= 300) {
	            res.status(500).send("Something went wrong! Status: " + response.statusCode);
	        }
	        if (!error && response.statusCode === 200) {
	        	var albums = JSON.parse(body).items;
	        	console.log(albums);
	        	res.render('../views/pages/artist', {
	        		artist: artist,
	        		albums: albums,
	        	}) ;
	        }
	    });
	});

		
};

module.exports = routes;