const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:

const clientId = '34cfe53e72fe4a348607c8c917a7de89',
    clientSecret = '65745d996e6148a4a72e58ab16877ebd';

const spotifyApi = new SpotifyWebApi({
clientId : clientId,
clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
.then( data => {
spotifyApi.setAccessToken(data.body['access_token']);
})
.catch(error => {
console.log('Something went wrong when retrieving an access token', error);
})



// the routes go here:

app.get('/', (request, response) => {
    response.render('index');
});

app.get('/artists', (request,response) => {
    
    const artistName = request.query.search; 
    spotifyApi.searchArtists(artistName)
    .then(data => {

      console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      const artistData = data.body.artists.items;
      response.render('artists', {artistData});
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })

})


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
