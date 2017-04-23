var keys = require("./keys.js");
var spotify = require('spotify');
var Twitter = require('twitter');
var request = require("request");
var fs = require("fs");
var nodeArgs = process.argv;
var songSearch = "";
var movieSearch = "";
var rottenSearch= "";

var client = new Twitter({
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret
});

for (var i = 3; i < nodeArgs.length; i++) {

  if (i > 3 && i < nodeArgs.length) {

    songSearch = songSearch + " " + nodeArgs[i];
    movieSearch = movieSearch + "+" + nodeArgs[i];
    rottenSearch = rottenSearch + nodeArgs[i];
  }
  else {
    songSearch += nodeArgs[i];
    movieSearch += nodeArgs[i];
    rottenSearch += nodeArgs[i];
  }
}

if (process.argv[2] === "my-tweets") {
    myTweets();
}

if (process.argv[2] === "spotify-this-song"){
    if(process.argv[3] != undefined) {
        spotifySongs();
    } else {
        spotify.search({ type: 'track', query: "Ace of Base OR The Sign"  }, function(err, data) {
            if ( err ) {
                console.log('Error occurred: ' + err);
                return;
            }
            console.log("The artist is " + data.tracks.items[0].artists[0].name);
            console.log("The name of the song is " + data.tracks.items[0].name);
            console.log("The preview url is " + data.tracks.items[0].preview_url);
            console.log("The name of the album is " + data.tracks.items[0].album.name);
        });
    }
}

if (process.argv[2] === "movie-this") {
    if(process.argv[3] != undefined) {
        movieThis();
    } else {
        var queryUrlTwo = "http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&r=json";
        request(queryUrlTwo, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                // console.log(JSON.parse(body));
                console.log("Move Title: " + JSON.parse(body).Title);
                console.log("Year the movie came out: " + JSON.parse(body).Year);
                console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                console.log("Country where the movie was produced: " + JSON.parse(body).Country);
                console.log("Movie language: " + JSON.parse(body).Language);
                console.log("Movie Plot: " + JSON.parse(body).Plot);
                console.log("Actors in movie: " + JSON.parse(body).Actors);
                console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                console.log("Rotten Tomatoes URL:" + JSON.parse(body).Website);
            }
        });
     }
}

if (process.argv[2] === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function(err, data) {
        console.log(data);
        var dataArr = data.split(",");
        console.log(dataArr);
        console.log(dataArr[0]);
        console.log(dataArr[1]);
        songSearch = dataArr[1];
        movieSearch = dataArr[1];
        if (dataArr[0] === "spotify-this-song"){
            if(dataArr[1] != undefined) {
               spotifySongs();
            }
        }
        if (dataArr[0] === "my-tweets") {
            myTweets();
        }
        if (dataArr[0] === "movie-this") {
            if(dataArr[1] != undefined) {
                movieThis();
            }
        }
    });
}

function myTweets() {
    var params = {screen_name: 'jsander112'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].created_at)
                console.log(tweets[i].text);
            }
        }
    });
}

function spotifySongs() {
    spotify.search({ type: 'track', query: songSearch }, function(err, data) {
            if ( err ) {
                console.log('Error occurred: ' + err);
                return;
            }
            for (var i = 0; i < data.tracks.items.length; i++) {
            console.log("The artist is " + data.tracks.items[i].artists[0].name);
            console.log("The name of the song is " + data.tracks.items[i].name);
            console.log("The preview url is " + data.tracks.items[i].preview_url);
            console.log("The name of the album is " + data.tracks.items[i].album.name);
            console.log("-------------");
            }
        });
}

function movieThis() {
    var queryUrl = "http://www.omdbapi.com/?t=" + movieSearch + "&y=&plot=short&r=json";
        request(queryUrl, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                // console.log(JSON.parse(body));
                console.log("Move Title: " + JSON.parse(body).Title);
                console.log("Year the movie came out: " + JSON.parse(body).Year);
                console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                console.log("Country where the movie was produced: " + JSON.parse(body).Country);
                console.log("Movie language: " + JSON.parse(body).Language);
                console.log("Movie Plot: " + JSON.parse(body).Plot);
                console.log("Actors in movie: " + JSON.parse(body).Actors);
                console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                console.log("Rotten Tomatoes URL:" + JSON.parse(body).Website);
            }
        });
}