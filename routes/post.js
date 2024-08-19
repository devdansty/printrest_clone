const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  caption: {
    type: String,
    trim: true,
    maxlength: 500 // Set a max length for the caption if needed
  },
  image: {
    type: String, // URL or path to the image
    required: true // Ensure the post has an image
  },        
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming there is a User model
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now // Automatically sets the post creation date
  },
  likes: [{
    type: Array,
    default:[]// Assuming likes are from users
  }]
});

// Create and export the Post model
const Post = mongoose.model('Post', postSchema);
module.exports = Post;
