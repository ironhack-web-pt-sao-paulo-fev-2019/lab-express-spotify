const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

hbs.registerPartials(`${__dirname}/views/partials`);


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
      console.log(artistData[0])
      response.render('artists', {artistData});
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })

})

app.get('/albums/:artistId', (request, response, next) => {
  const artistId = request.params.artistId;
  spotifyApi.getArtistAlbums(artistId)
  .then(function(data) {
    const albums = data.body.items;
    console.log(albums[0])
    response.render('albums', {albums})
  }, function(err) {
    console.error(err);
  });

});

app.get('/tracks/:albumId', (request, response, next) => {
  const { albumId } = request.params;

  spotifyApi.getAlbum(albumId)
    .then(function(data) {
      const  tracks  = data.body.tracks.items;
      response.render('tracks', { tracks });
    })
    .catch(function(error) {
      console.error(error);
    });
})


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
