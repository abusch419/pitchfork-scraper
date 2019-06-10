
// from homework instructions

// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// mongoose.connect(MONGODB_URI)

// dependencies
var express = require("express");
var mongojs = require("mongojs");
var cheerio = require("cheerio");
var axios = require("axios");

// Axios request to pitchfork best albums of the week 
axios.get("https://pitchfork.com/reviews/best/albums/").then(function(response) {

  // Load the HTML into cheerio and save it to a variable
  var $ = cheerio.load(response.data);
  var results = [];

//  select the artist name and album name 
  $(".artist-list").each(function(i, element) {

    var artist = $(element).text()
    var album = $(element).next(".review__title-album").text()

    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      artist: artist,
      album: album,
    });
  });

  // Log the results once you've looped through each of the elements found with cheerio
  console.log(results);
});


// Initialize Express
var app = express();

// Set up a static folder (public) for our web app
app.use(express.static("public"));

// Database configuration
// Save the URL of our database as well as the name of our collection
var databaseUrl = "albumsOfTheWeek";
var collections = ["albums"];

// Use mongojs to hook the database to the db variable
var db = mongojs(databaseUrl, collections);

// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", function(error) {
  console.log("Database Error:", error);
});

app.get("/all", function(req, res) {
    // Query: In our database, go to the animals collection, then "find" everything
    db.albums.find({}, function(error, found) {
      // Log any errors if the server encounters one
      if (error) {
        console.log(error);
      }
      // Otherwise, send the result of this query to the browser
      else {
        res.json(found);
      }
    });
  });

// Set the app to listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
