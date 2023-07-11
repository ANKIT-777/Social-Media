
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');


const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  // Add any other relevant information here
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }]

});



const User = mongoose.model('User', userSchema);

module.exports = User;
