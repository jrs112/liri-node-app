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
    logEntry();
    myTweets();
}

if (process.argv[2] === "spotify-this-song"){
    logEntry();
    if(process.argv[3] != undefined) {
        spotifySongs();
    } else {
        defaultSong();
    }
}

if (process.argv[2] === "movie-this") {
    logEntry();
    if(process.argv[3] != undefined) {
        movieThis();
    } else {
       defaultMovie();
     }
}

if (process.argv[2] === "do-what-it-says") {
    logEntry();
    fs.readFile("random.txt", "utf8", function(err, data) {
        var dataArr = data.split(",");
        console.log(dataArr);
        songSearch = dataArr[1];
        movieSearch = dataArr[1];
        if (dataArr[0] === "spotify-this-song"){
            if(dataArr[1] != undefined) {
               spotifySongs();
            } else{
                defaultSong();
            }
        }
        if (dataArr[0] === "my-tweets") {
            myTweets();
        }
        if (dataArr[0] === "movie-this") {
            if(dataArr[1] != undefined) {
                movieThis();
            } else{
                defaultMovie();
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
                fs.appendFile("log.txt", "----" + tweets[i].created_at + ", " + tweets[i].text, function() {});
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
            fs.appendFile("log.txt", "The artist is " + data.tracks.items[i].artists[0].name + ", " +
            "The name of the song is " + data.tracks.items[i].name + ", " +
            "The preview url is " + data.tracks.items[i].preview_url + ", " +
            "The name of the album is " + data.tracks.items[i].album.name + "----", function() {});
            }
    });
}

function defaultSong() {
    spotify.search({ type: 'track', query: "Ace of Base OR The Sign"  }, function(err, data) {
            if ( err ) {
                console.log('Error occurred: ' + err);
                return;
            }
            console.log("The artist is " + data.tracks.items[0].artists[0].name);
            console.log("The name of the song is " + data.tracks.items[0].name);
            console.log("The preview url is " + data.tracks.items[0].preview_url);
            console.log("The name of the album is " + data.tracks.items[0].album.name);
            fs.appendFile("log.txt", " The artist is " + data.tracks.items[0].artists[0].name + ", " +
            "The name of the song is " + data.tracks.items[0].name + ", " +
            "The preview url is " + data.tracks.items[0].preview_url + ", " +
            "The name of the album is " + data.tracks.items[0].album.name, function() {});
    });
}

function movieThis() {
    var queryUrl = "http://www.omdbapi.com/?t=" + movieSearch + "&y=&plot=short&r=json";
    request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            // console.log(JSON.parse(body));
            console.log("Movie Title: " + JSON.parse(body).Title);
            console.log("Year the movie came out: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Country where the movie was produced: " + JSON.parse(body).Country);
            console.log("Movie language: " + JSON.parse(body).Language);
            console.log("Movie Plot: " + JSON.parse(body).Plot);
            console.log("Actors in movie: " + JSON.parse(body).Actors);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Website:" + JSON.parse(body).Website);
            fs.appendFile("log.txt", "Move Title: " + JSON.parse(body).Title + ", " +
            "Year the movie came out: " + JSON.parse(body).Year + ", " + "IMDB Rating: " + JSON.parse(body).imdbRating +
            ", " + "Country where the movie was produced: " + JSON.parse(body).Country + ", " +
            "Movie language: " + JSON.parse(body).Language + ", " + "Movie Plot: " + JSON.parse(body).Plot +
            ", " + "Actors in movie: " + JSON.parse(body).Actors + ", " + "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value +
            ", " + "Website: " + JSON.parse(body).Website, function() {});
        }
    });
}

function defaultMovie() {
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
            console.log("Website: " + JSON.parse(body).Website);
            fs.appendFile("log.txt", "Movie Title: " + JSON.parse(body).Title + ", " +
            "Year the movie came out: " + JSON.parse(body).Year + ", " + "IMDB Rating: " + JSON.parse(body).imdbRating +
            ", " + "Country where the movie was produced: " + JSON.parse(body).Country + ", " +
            "Movie language: " + JSON.parse(body).Language + ", " + "Movie Plot: " + JSON.parse(body).Plot +
            ", " + "Actors in movie: " + JSON.parse(body).Actors + ", " + "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value +
            ", " + "Website: " + JSON.parse(body).Website, function() {});
        }
    });
}

function logEntry() {
    fs.appendFile("log.txt", "********" + process.argv[2] + ", " + songSearch + "--------", function() {});
}

