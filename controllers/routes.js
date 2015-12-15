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
		var artistNameSplit = req.params.artist.split("-");
		var artistName = [],
			artist;
		artistNameSplit.forEach(function(word) {
			artistName.push(capitalizeFirstLetter(word));
		});
		artist = artistName.join(" ");
		var artistId = req.params.artistId;
		request.get("https://api.spotify.com/v1/artists/" + artistId + '/albums', function(error, response, body) {
	        if (error) {
	            res.status(500).send("You got an error - " + error);
	        } else if (!error && response.statCode >= 300) {
	            res.status(500).send("Something went wrong! Status: " + response.statusCode);
	        }
	        if (!error && response.statusCode === 200) {
	        	var albums = JSON.parse(body).items,
	        		albumReleaseDates = [],
	        		trackAccumulator = []; 
	        	albums.forEach(function(album) {
	        		request.get("https://api.spotify.com/v1/albums/" + album.id, function(error, response, body) {
	        	        if (error) {
	        	            res.status(500).send("You got an error - " + error);
	        	        } else if (!error && response.statCode >= 300) {
	        	            res.status(500).send("Something went wrong! Status: " + response.statusCode);
	        	        }
	        	        if (!error && response.statusCode === 200) {
	        	        	var releaseDate = JSON.parse(body).release_date,
	        	        		trackList = JSON.parse(body).tracks.items,
	        	        		tracks = getTracks(trackList, trackAccumulator);
	        	        		if (trackAccumulator.length === trackList.length) {
	        	        			console.log(trackAccumulator);
	        	        		}
	        	        	albumReleaseDates.push(releaseDate);
	        	        	if (albumReleaseDates.length === albums.length) {
	        		        	res.render('../views/pages/artist', {
	        		        		artist: artist,
	        		        		albums: albums,
	        		        		albumReleaseDates: albumReleaseDates,
	        		        		tracks
	        		        	}) ;
	        				};
	        	        }
	        	    });
	        	});
	        }
	    });
	});
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

function getTracks(trackList, trackAccumulator) {
	var tracks = {
		list: []
	};
	trackList.forEach(function(track) {
		tracks.list.push(track.name);
	})
	trackAccumulator.push(tracks);
	return tracks;
};



module.exports = routes;