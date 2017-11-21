$(document).on("click", "#btn_scrape", function() {
    $("#articles").empty();

    $.ajax({
            method: "GET",
            url: "/scrape"
        })
        .done(function(data) {
            console.log(data);
            $("#articles").show();
            $("#savedArticles").hide();
            for (var i = 0; i < data.length; i++) {
                var newDiv = $("<div>");
                newDiv.addClass("div_article");
                newDiv.attr('matchTitle', data[i].matchTitle);
                newDiv.attr('storyTitle', data[i].storyTitle);
                newDiv.attr('articleLink', data[i].articleLink);
                newDiv.append("<p class='match_title'>" +data[i].matchTitle + "</p>");
                newDiv.append("<a href='" + data[i].articleLink + "' target=_blank>" + data[i].storyTitle + "</a>");
                newDiv.append("<img class='img_wrap' src='" + data[i].imgLink + "'>");
                newDiv.append("<p class='p_story'>" + data[i].story + "</p>")
                newDiv.append("<button class='btn_saveArticle' data-id='" + data[i]._id + "'> Save article </button>");
                $("#articles").append(newDiv);
           }
        });
});
$(document).on("click", ".btn_saveArticle", function() {

    $.ajax({
            method: "POST",
            url: "/saveArticle",
            data: {
                matchTitle: $(this).parent().attr("matchTitle"),
                storyTitle: $(this).parent().attr("storyTitle"),
                articleLink: $(this).parent().attr("articleLink"),
                story: $(this).parent().find("p").text(),
                imgLink: $(this).parent().find("img").attr("src")
            }
        })
        .done(function(data) {
          $(this).parent().hide();// remove saved artice from the Scraped articles list
        });
});

//Delete a saved article
$(document).on("click", ".btn_delArticle", function() {
	console.log("Delete article button clicked");
    var thisId = $(this).attr("data-id");
        $.ajax({
        method: "GET",
        url: "/deleteArticle/" + thisId
    }).done(function(data) {
        $(this).parent().hide();
    });

});
//Display empty/existing notes
$(document).on("click",".btn_notes",function(){
	$("#notes").empty();
  $("#notes").show();
  // Save the id 
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    
    .done(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h4>" + data.matchTitle + "</h4>");
      $("#notes").append("<h2>" + data.storyTitle + "</h2>");
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button class='btn-success' data-id='" + data._id + "' id='savenote'>Save</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

//To save notes

$(document).on("click", "#savenote", function() {
   var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
      .done(function(data) {
      console.log(data);
      $("#notes").empty();
    });
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

//Display all saved articles
$(document).on("click", "#btn_savedArticles", function() {
	$("#notes").hide();
	$("#savedArticles").empty();
    $.ajax({
        method: "GET",
        url: "/savedArticles"
    }).done(function(data) {
        $("#articles").hide();
        $("#savedArticles").show();
        for (var i = 0; i < data.length; i++) {
            var newDiv = $("<div>");
            newDiv.addClass("div_savedArticle");
            newDiv.attr('matchTitle', data[i].matchTitle);
            newDiv.attr('storyTitle', data[i].storyTitle);
            newDiv.attr('articleLink', data[i].articleLink);
            newDiv.append("<a href='" + data[i].articleLink + "' target=_blank>" + data[i].storyTitle + "</a>");
            newDiv.append("<img src='" + data[i].imgLink + "'>");
            newDiv.append("<p>" + data[i].story + "</p>")
            newDiv.append("<button class='btn_notes btn-success' data-id='" + data[i]._id + "'> Add Notes </button>");
            newDiv.append("<button class='btn_delArticle btn-warning' data-id='" + data[i]._id + "'> Delete Article </button>");
            $("#savedArticles").append(newDiv);
        }
    });
});

window.onload=function(){
	$("#articles").hide();
	$("#savedArticles").hide();
	$("#notes").hide();
}
