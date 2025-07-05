const mongoose = require('mongoose');
require('dotenv').config();
const COMMENT = process.env.COMMENT || 2;

const Comment = new mongoose.Schema({
  comentario: {
    type: String,
    required: true,
    trim: true,
    minlength: [5, 'El comentario debe tener al menos 1 caracter'],
    maxlength: [200, 'El comentario no puede exceder los 500 caracteres']

  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


Comment.virtual('esVisible').get(function () {
  const fechaLimite = new Date();
  fechaLimite.setMonth(fechaLimite.getMonth() - COMMENT);
  return this.createdAt >= fechaLimite;
});

module.exports = mongoose.model('Comment', Comment);
