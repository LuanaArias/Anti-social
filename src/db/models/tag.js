const mongoose = require('mongoose');

const Tag = new mongoose.Schema({
  descripcion: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: [5, 'La descripción debe tener al menos 5 caracteres'],
    maxlength: [50, 'La descripción no puede exceder los 50 caracteres'],
  }
}, {
  timestamps: false
});

module.exports = mongoose.model('Tag', Tag);
