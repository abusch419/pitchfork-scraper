var db = require("../models");

var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function (app) {

// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://pitchfork.com/reviews/best/albums/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    
    // Now, we grab every h2 within an article tag, and do the following:
    $(".review").each(function (i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.reviewLink = $(this).find('a').attr('href')
      result.albumArt = $(this).find('img').attr('src')
      result.artistName = $(this).find('.artist-list').text()
      result.albumName = $(this).find('h2').text()
      result.genre = $(this).find('.genre-list__item').text()
      result.releaseDate = $(this).find('.pub-date').text()


      db.Album.find({ albumName: result.albumName }, function (err, docs) {
        if (docs.length) {
          console.log("do nothing")
        }
        else {
          db.Album.create(result)
            .then(function (dbAlbums) {
              // View the added result in the console
              console.log(dbAlbums);
            })
            .catch(function (err) {
              // If an error occurred, log it
              console.log(err);
            })
        }
      });
    
    });
    res.send("Scraped!")
  });
});

// Route for getting all Articles from the db
app.get("/albums", function (req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Album.find({})
    .then(function (dbAlbums) {
      res.json(dbAlbums)
    })
    .catch(function (err) {
      res.json(err)
    })
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/albums/:id", function (req, res) {
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
  db.Album.findOne({ _id: req.params.id })
    .populate("note")
    .then(function (dbAlbums) {
      res.json(dbAlbums)
    })
    .catch(function (err) {
      res.json(err)
    })

});

// Route for saving/updating an Article's associated Note
app.post("/albums/:id", function (req, res) {
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
  db.Note.create(req.body)
    .then(function (dbNote) {
      return db.Album.findOneAndUpdate({ _id: req.params.id }, { $set: { note: dbNote._id } }, { new: true })
    })
    .then(function (dbAlbum) {
      res.json(dbAlbum)
    })
    .catch(function (err) {
      res.json(err)
    })
});


}