var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var AlbumSchema = new Schema({
  // `artist` is required and of type String
  artistName: {
    type: String,
    required: true
  },
  // `album` is required and of type String
  albumName: {
    type: String,
    required: true
  },
  // `note` is an object that stores a Note id
  // The ref property links the ObjectId to the Note model
  // This allows us to populate the Album with an associated Note
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// This creates our model from the above schema, using mongoose's model method
var Album = mongoose.model("Album", AlbumSchema);

// Export the Album model
module.exports = Album;
