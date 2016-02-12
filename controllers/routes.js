"use strict";
var request = require('request');
var prettyJson = require('prettyjson');

function routes(app) {
	app.get('/', function(req, res) {
		res.redirect('/search');
	});

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

	var artistInfo = promisifyGet()

	app.get('/:artist/:artistId', function(req, res) {
		var artistNameSplit = req.params.artist.split("-"),
			artistName = [],
			artist,
			//put all album info in in flat album info obj (name, release date, art, tracks, popularity)
			albumInfo = {};
		artistNameSplit.forEach(function(word) {
			artistName.push(capitalizeFirstLetter(word));
		});
		artist = artistName.join(" ");
		var artistId = req.params.artistId,
			artistInfoPromise = promisifyGet("https://api.spotify.com/v1/artists/" + artistId + '/albums')
		.then(function(artistQueryResponse) {
			var albums = JSON.parse(artistQueryResponse.body).items,
				albumPromises = []; 
			albums.forEach(function(album) {
				var id = album.id;
				albumInfoPromise = promisifyGet("https://api.spotify.com/v1/albums/" + album.id)
				albumPromises.push(albumInfoPromise);
			})
			return Promise.all(albumPromises);
		}).then(function(resolvedAlbums) {
			var albumIds = resolvedAlbums.map(function(albumData) {
				var responseBody = JSON.parse(albumData.body),
					albumInfoObj =  {
					albumName: responseBody.name,
					releaseDate: responseBody.release_date,
					tracks: responseBody.tracks.items,
					coverArt: responseBody.images[1].url
				}
				albumInfo[responseBody.id] = albumInfoObj;
				return responseBody.id;
			})
			return albumIds;
		}).then(function(albumIds) {	
			trackPromises = [];			
			albumIds.forEach(function(albumId) {
				var currentAlbumTracks = albumInfo[albumId].tracks;	
				currentAlbumTracks.forEach(function(track) {
						var trackPromise = promisifyGet("https://api.spotify.com/v1/tracks/" + track.id, albumId);
						trackPromises.push(trackPromise);
				});	
			});
			return Promise.all(trackPromises);
		}).then(function(trackInfo) {
			var trackPopularity = {};
			trackInfo.forEach(function(track) {
				var albumId = track.extraData;
				trackPopularity[albumId] = [];
			});
			trackInfo.forEach(function(track) {
				var albumId = track.extraData,
					popularity = JSON.parse(track.body).popularity;	
				trackPopularity[albumId].push(popularity);
			});
			for (album in albumInfo) {
				var currentAlbumTracks = albumInfo[album].tracks;
				for(var i = 0; i < currentAlbumTracks.length; i++) {
					currentAlbumTracks[i].popularity = trackPopularity[album][i];
				}
				console.log(currentAlbumTracks);
			}
			res.render('../views/pages/artist', {artist: artist, albumInfo: albumInfo});
		}).catch(function(err) {
			if (err) throw err;
		});
		
	});
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

function promisifyGet(url, extraData) {
	//return resolution of promise
	return new Promise(function(resolve, reject) {
		//promise handles callback of get request
		request.get(url, function(error, response, body) {
			if (error) {
				reject(error);
			} else {
				response.extraData = extraData;
				resolve(response);
			}
		});
	});
}

module.exports = routes;