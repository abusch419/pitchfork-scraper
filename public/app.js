// Grab the albums as a json
$.getJSON("/albums", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    let albumCard = `
    <div class="card col-12 col-md-12 col-lg-6" data-id="${data[i]._id}" style="width: 18rem;">
    <div class="card-header">
      <h3 class="artist-name">${data[i].artistName}</h3>
      <h4 class="album-name">${data[i].albumName}</h4>
      <h4 class="genre-name">${data[i].genre}</h4>
      <h4 class="genre-name">${data[i].releaseDate}</h4>
    </div>
    <img class="card-img-top" src="${data[i].albumArt}" alt="albumImage">
    <div class="card-body">
      <div class="row">
        <a class="btn col-12 btn-default proj-btn" id="l-link"
          href="https://pitchfork.com${data[i].reviewLink}">Read Review</a>
        <a class="btn col-12 btn-default proj-btn" id="r-link"
          href="#">Create Spotify Playlist</a>
      </div>
    </div>
  </div>`
    $("#albums").append(albumCard);
  }
});



// Whenever someone clicks a p tag
$(document).on("click", ".card", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/albums/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // The artistName of the article
      $("#notes").append("<h2>" + data.artistName + "</h2>");
      // An input to enter a new artistName
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

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
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
