//Perform the scrape by clicking the Scrape button
$(document).on("click", "#scrape", function() {
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
});

// List the scraped articles by clicking the List Articles button
$(document).on("click", "#listArticles", function() {

  // A test needs to be added here
  // to see if there are repeats in the list of articles
  // Add a counter so that a current version of (data) can be
  // compared to the incoming version of (data).
  // If a title is the same, skip over that set of data (i), and test next one.

  // Get the articles as a json
  $.getJSON("/articles", function(data) {
  // For each one
    for (var i = 0; i < data.length; i++) {
    // Display the information on the page
      $("#articles").append("<p data-id='" +
      data[i]._id + "'>" +
      data[i].title + "</p><button data-title='" +
      data[i].title + "' class='deleteArticle'>Delete Article</button><a href='" +
      data[i].link + "' target='_blank'>" +
      data[i].link + "</a>");
    }
  });
});

// When the title of an article (with a p tag) is clicked
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='saveNote'>Save Note</button>");
      // Here's a button to delete a note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='deleteNote'>Delete Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When the Save Note button is clicked
$(document).on("click", "#saveNote", function() {
  // Get the id associated with the article
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

// When you click the Delete Note button
$(document).on("click", "#deleteNote", function() {
  // Grab the id associated with the article
  var thisId = $(this).attr("data-id");
  console.log(thisId);
  // Run a DELETE request to delete the note
  $.ajax({
    method: "DELETE",
    url: "/articles/" + thisId
  })
    // still need to empty the notes div as before
    .then(function() {
      $("#notes").empty();
    });

  // And remove the values entered in the input and textarea as before
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

// When the Delete Article button is clicked
$(document).on("click", ".deleteArticle", function() {
  //empty out the articles section in order to repopulate with the current list of articles
  //after the proper one is deleted.
  $("#articles").empty();
  // Grab the title associated with the article
  var thisTitle = $(this).attr("data-title");

  console.log(thisTitle);

  // Run a DELETE request to delete the article
  $.ajax({
    method: "DELETE",
    url: "/articles/test/" + thisTitle
  })
    //need to relist the articles without the deleted one
    .then(function() {
      //empty out the articles section in order to repopulate with the current list of articles
      //without the recently deleted one.

      $.getJSON("/articles", function(data) {
        // For each one
        console.log(data);
          for (var i = 0; i < data.length; i++) {
          // Display the information on the page
            $("#articles").append("<p data-id='" +
            data[i]._id + "'>" +
            data[i].title + "</p><button data-title='" +
            data[i].title + "' class='deleteArticle'>Delete Article</button><a href='" +
            data[i].link + "' target='_blank'>" +
            data[i].link + "</a>");
          }
        });
    });
});
