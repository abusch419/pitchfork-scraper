// scrape the website, if there are new albums add them to the database, 
// if not, show a message that the database is up to date
$("#scrape").on("click", function (e) {
  e.preventDefault()
  console.log("scrape")
  return $.get("/scrape", function (data) {

  }).then(renderAlbums())
})



function renderAlbums(data) {
  // Grab the albums which are currently in the databse as a json
  $.getJSON("/albums", function (data) {
    $(".albums").empty()
    // For each one
    for (let i = 0; i < data.length; i++) {
      // run get uri async
      getAlbumUri(data[i].albumName, access_token)
        .then(function (response) {
          let albumCard = 
  `<div class="card col-xs-12 col-sm-12 col-md-3 col-lg-3" style="width: 18rem;">
  <div class="card-header" id="project-name">
    ${data[i].artistName}
  </div>
  <img class="card-img-top" src="${data[i].albumArt}" data-id="${data[i]._id}" alt="albumImage">      
  <div class="row" id="notes" data-id="${data[i]._id}"></div>
  <div class="card-body">
    <p class="card-text">Album Name: ${data[i].albumName}</p>
    <p class="card-text">Genre: ${data[i].genre}</p>
    <p class="card-text">Released: ${data[i].releaseDate}</p>
    <div class="row">
      <a class="btn album-btn col-12 btn-default review-btn" id="l-link" href="https://pitchfork.com${data[i].reviewLink}">Read
        Review</a>
      <a class="btn album-btn col-12 btn-default spotify-btn" id="r-link" href="${response.albums.items[0].uri}">Listen In
        Spotify</a>
    </div>
  </div>
</div>`
          $("#albums").append(albumCard)
        }
        )
      // Display the apropos information on the page

    }

  });
}








// Whenever someone clicks an album
$(document).on("click", ".card-img-top", function () {
  
  // Empty the notes from the note section
  
  
  // Save the id from the album
  var thisId = $(this).attr("data-id");
  let selectedNote = $(`#notes[data-id="${thisId}"]`)
  $(selectedNote).empty();
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/albums/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // A textarea to add a new note body
      $(selectedNote).append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $(selectedNote).append(`<a class="btn album-btn col-12 btn-default" data-id="${data._id}" id="savenote">Save</a>`);
      // If there's a note in the article
      if (data.note) {
        // Place the artistName of the note in the artistName input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  let selectedNote = $(`#notes[data-id="${thisId}"]`)
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/albums/" + thisId,
    data: {
      // Value taken from artistName input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $(selectedNote).empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

function getAlbumUri(searchParams, token) {
  return $.ajax({
    url:
      "https://api.spotify.com/v1/search?q=" +
      searchParams +
      "&" +
      "type=album",
    method: "GET",
    headers: {
      Authorization: "Bearer " + token
    },

  })

}



