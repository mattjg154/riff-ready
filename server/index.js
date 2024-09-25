const express = require('express');
const request = require('request');
const dotenv = require('dotenv');


const PORT = 5000

global.access_token = ''

dotenv.config()

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;

var spotify_redirect_uri = 'http://localhost:3000/auth/callback';

var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) { //for length pick a random character from possible
    text += possible.charAt(Math.floor(Math.random() * possible.length)); //append the character
  }
  return text;
};

var app = express();


app.get('/auth/login', (req, res) => { //called from Login component
  console.log(spotify_client_id);

  var scope = "streaming";//sets permission parameters
  var state = generateRandomString(16); //a randomly generated string to protect against attacks such as cross-site request forgery

  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope, 
    redirect_uri: spotify_redirect_uri,
    state: state
  })

  res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString()); //goes to authorise page which returns to callback
})                                                                                             //with a code to get the access token

app.get('/auth/callback', (req, res) => { //redirect url

  var code = req.query.code; 

  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: spotify_redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
      'Content-Type' : 'application/x-www-form-urlencoded'
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) { //if access token retrieved redirect to app
      console.log(body.access_token);
      access_token = body.access_token;
      res.redirect('/')
    }
  });

})

app.get('/auth/token', (req, res) => {
  console.log("Access Token:", access_token);
  res.json({ access_token: access_token });
});


app.listen(5000, console.log("Server started on PORT 5000"));