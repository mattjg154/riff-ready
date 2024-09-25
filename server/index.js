const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;

const app = express();


app.use("/", (req,res)=>{
    res.send("Server is running");
});

app.get("/auth/login", (req,res)=>{
    var code = req.query.code;

  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: "https://riff-ready-server-8bncjf79e-matts-projects-34ff5dbc.vercel.app/auth/callback",
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
      'Content-Type' : 'application/x-www-form-urlencoded'
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.redirect('/')
    }
  });
});

app.get('/auth/token', (req, res) => {
    res.json(
       {
          access_token: access_token
       })
  })

app.get("/auth/callback", (req,res)=>{

})

app.listen(5000, console.log("Server is on port 5000"));