require("dotenv").config();

// variables to link the different NPM packages and other files
var axios = require("axios");
var fs = require("fs");
var keys = require("./keys.js");
var moment = require('moment');
moment().format()
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var userSearch = process.argv[2];
var userInput = process.argv[3];

// switch statement to identify what the user is trying to look for
// from there we can call the correct function to perform the desired task
switch (userSearch) {
    case 'spotify-this-song':
        showSongInfo(userInput);
        break;
    case 'movie-this':
        showMovieInfo(userInput);
        break;
    case 'concert-this':
        showConcertInfo(userInput);
        break;
    case 'do-what-it-says':
        showDoInfo();
        break;
    default:
        console.log("Please enter one of the following with your desired output: \nconcert-this \nspotify-this-song \nmovie-this \ndo-what-it-says")

};

// function to search spotify for the track input by the user
// if nothing is input, it will automatically use the input to find "the sign" by ace of base
function showSongInfo(userInput) {
    if (!userInput) {
        userInput = 'The Sign Ace';
    }
    spotify
        .search({ type: 'track', query: userInput })
        .then(function (response) {
            for (var i = 0; i < 3; i++) {
                var songResults =
                    "-------------------------------------------------------------------------------------------" +
                    "\nSong Name: " + response.tracks.items[i].name +
                    "\nArtist: " + response.tracks.items[i].artists[0].name +
                    "\nAlbum Name: " + response.tracks.items[i].album.name +
                    "\nLink: " + response.tracks.items[i].preview_url;

                console.log(songResults);
                outputData(songResults);

            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

// function to search OMDB database based on user input
// if no user input, it will automatically search for the movie 'Mr. Nobody'
function showMovieInfo(userInput) {
    if (!userInput) {
        userInput = "mr nobody";
    }
    axios.get("https://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy")
        .then(function (response) {
            var movieResults =
                "-------------------------------------------------------------------------------------------" +
                "\nTitle: " + response.data.Title +
                "\nRelease Date: " + response.data.Year +
                "\nIMDB Rating: " + response.data.imdbRating +
                "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value +
                "\nCountry: " + response.data.Country +
                "\nLanguage: " + response.data.Language +
                "\nPlot: " + response.data.Plot +
                "\nActors: " + response.data.Actors;
            console.log(movieResults);
            outputData(movieResults);

        })
        .catch(function (error) {
            console.log(error);
        });

};

// function to search for band's concert
function showConcertInfo() {
    axios.get("https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp")
        .then(function (response) {
            for (var i = 0; i < response.data.length; i++) {

                var dateTime = response.data[i].datetime;
                var dateArr = dateTime.split('T');

                var concertResults =
                    "-------------------------------------------------------------------------------------------" +
                    "\nVenue: " + response.data[i].venue.name +
                    "\nVenue Location: " + response.data[i].venue.city +
                    "\nDate of the Event: " + moment(dateArr[0], "YYYY-DD-MM").format("MM-DD-YYYY");
                console.log(concertResults);
                outputData(concertResults);
            }
        })
        .catch(function (error) {
            console.log(error);
        });


}

// add the search results to the log.txt file each time someone seaches something.
function outputData(data) {
    fs.appendFile('log.txt', data + '\n', function (err) {
        if (err) throw err
    })
    // the command below clears the log.txt file when this is run
    // fs.unlinkSync("log.txt");
}


function showDoInfo() {
    fs.readFile('random.txt', "utf8", function (err, res) {
        if (err) {
            return console.log(err);
        }
        inputArr = res.replace(/"/g, '').trim().split(',');
        showSongInfo(inputArr[1]);
    });
}