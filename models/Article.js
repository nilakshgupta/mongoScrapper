// Require mongoose
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ArticleSchema = new Schema({
  matchTitle: {
    type: String,
    required: true
  },
  storyTitle: {
    type: String,
    required: true
  },
  story:{
    type: String,
    required: true
  },
   imgLink: {
    type: String,
    required: true
  },
  articleLink: {
    type: String,
    required: true
  }, 
    note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;