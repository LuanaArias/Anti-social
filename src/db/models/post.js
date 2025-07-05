const mongoose = require('mongoose');

const Post = new mongoose.Schema({
  contenido: {
    type: String,
    required: true,
    trim: true,
    minlength: [10, 'El contenido debe tener al menos 5 caracteres'],
    maxlength: [200, 'El contenido no puede exceder los 500 caracteres']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comment: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    required: false
  }],
  image: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post_Image',
    required: false
  }],
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
    required: false
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


module.exports = mongoose.model('Post', Post);
