// Dependencies
var express = require("express");
    bodyParser = require("body-parser");
    logger = require("morgan");
    mongoose = require("mongoose");
    Note = require("./models/Note.js");
    Article = require("./models/Article.js");
    request = require("request");
    cheerio = require("cheerio");
    PORT =3000,
    app = express();

    app.use(logger("dev"));
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(express.static("public"));
    mongoose.Promise = Promise;
    mongoose.connect("mongodb://localhost/CricInfo", {
      useMongoClient: true
    });

// Routes
// ======
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    request("http://www.espncricinfo.com/ci/content/story/news.html", function(error, response, html) {
        var $ = cheerio.load(html);
        // Save an empty result array
        var result = [];
        $("article.story-item").each(function(i, element) {
            var matchTitle = $(this).find("p.match-title").text()
            var storyTitle = $(this).find("h2.story-title").text();
            var story = $(this).find("p.story-brief").text();
            var imgLink = "http://p.imgci.com" + $(this).find("img.img-full").attr("src");
            var articleLink = "http://www.espncricinfo.com" + $(this).find("figure.story-img").children("a").attr("href");

            // For each h4-tag, make an object with data we scraped and push it to the result array
            result.push({
                matchTitle: matchTitle,
                storyTitle: storyTitle,
                story: story,
                imgLink: imgLink,
                articleLink: articleLink
            });

        });

        res.send(result);
    });
});
 // saving entry to the db
app.post("/saveArticle", function(req, res) {
    console.log(req.body);
    var newArticle = new Article(req.body);   
    newArticle.save(function(err, doc) {
        if (err) {
          console.log(err);
        }else {
          console.log(doc);
        }
      });
});

//Grabing all saved articles
app.get("/savedArticles",function(req,res){
     Article.find({}, function(error, doc) {
     if (error) {
      console.log(error);
    }else {
      res.json(doc);
    }
  });
});

app.get("/deleteArticle/:id",function(req,res){   
    Article.deleteOne({"_id":req.params.id}, function(err, results) {
       if (err){
         console.log("failed");
         throw err;
       }
       console.log("success");
    });
});

// Grabing articles by it's ObjectId
app.get("/articles/:id", function(req, res) {
    Article.findOne({ "_id": req.params.id })
    .populate("note")
     .exec(function(error, doc) {
       if (error) {
         console.log(error);
       }else {
          res.json(doc);
       }
     });
});

// Updatig Notes
app.post("/articles/:id", function(req, res) {
    var newNote = new Note(req.body);
    newNote.save(function(error, doc) {
    if (error) {
      console.log(error);
    }else {
      Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
      .exec(function(err, doc) {
       if (err) {
          console.log(err);
      }else {
           res.send(doc);
        }
      });
    }
  });
});

// Listen on port 3000
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});
