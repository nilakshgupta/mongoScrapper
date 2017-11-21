// Require mongoose
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var NoteSchema = new Schema({
   title: String,
  body: String
});

var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;