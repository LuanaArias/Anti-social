const mongoose = require('mongoose');

const User = new mongoose.Schema({
  nickName: {
    type: String,
    required: [true, 'El nickname es obligatorio'],
    unique: true,
    trim: true,
    minlength: [8, 'El nickname debe tener al menos 8 caracteres'],
    maxlength: [12, 'El nickname no puede exceder los 12 caracteres'],

  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Debe ser un email válido'
    }
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
    posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: false
});

module.exports = mongoose.model('User', User);
