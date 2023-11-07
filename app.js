require('dotenv').config();
const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node')
// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET
});
//Retrieve an access token
spotifyApi
.clientCredentialsGrant()
.then(data => spotifyApi.setAccessToken(data.body['access_token']))
.catch((error) => {
    console.log('The error while searching artist ocurred: ', error);
})
.catch(error => console.log('Something went wrong when retrieving an access token', error))

// Our routes go here:
//way to layout page
app.get("/home", (request, response) => {
    response.render("home")
})

app.get("/artist-search", (request, response) => {
    const findArtist = request.query.search;
    console.log (findArtist)
    spotifyApi.searchArtists(findArtist)
  .then((teste) => {
    console.log('Search artists by "Love"', teste.body.artists);
    const artistsResult = teste.body.artists.items;
    response.render("artist-search", {artistsResult})
  })
  .catch((error) => console.log(error));
})

app.get("/artist-search-results", (request, response, next) => {
    response.render("artist-search-results")
})

app.get("/albums", (request, response) => {
    response.render("albums")
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));