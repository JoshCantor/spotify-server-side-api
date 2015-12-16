var request = require('request');
var prettyJson = require('prettyjson');

function routes(app) {
	app.get('/search', function(req, res) {
		res.render('../views/pages/search');
	});

	app.post("/search", function (req, res) {
		var search = req.body.artistSearch.toString().split(' ').join('-');
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
	        		albumData = {
	        			name: artist,
	        			allAlbumAndTrackData: []			
	        		};
	        	getAlbumInfo(res, albumData, albums);	
	        }
	    });
	});
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

function parseAlbumData(body, albumData) {
	var albumName = JSON.parse(body).name.toString(),
		releaseDate = JSON.parse(body).release_date,
		trackList = JSON.parse(body).tracks.items,
		album = {};
		
		album.name = albumName;
		album.tracks = [];
	
	trackList.forEach(function(track) {
		album.releaseDate = releaseDate;
		album.tracks.push(track.name);
	})
	albumData.allAlbumAndTrackData.push(album);
	return album;
};


function renderPage(res, albumData, albums) {
	if (albumData.allAlbumAndTrackData.length === albums.length) {
    	res.render('../views/pages/artist', {
    		albumData: albumData,
    	}) ;
	};
};

function getAlbumInfo(res, albumData, albums) {
	albums.forEach(function(album) {
		request.get("https://api.spotify.com/v1/albums/" + album.id, function(error, response, body) {
	        if (error) {
	            res.status(500).send("You got an error - " + error);
	        } else if (!error && response.statCode >= 300) {
	            res.status(500).send("Something went wrong! Status: " + response.statusCode);
	        }
	        if (!error && response.statusCode === 200) { 	
	        		parseAlbumData(body, albumData);
	        		renderPage(res, albumData, albums);
	        }
	    });
	});
}

module.exports = routes;