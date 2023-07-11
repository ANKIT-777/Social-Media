
const express = require('express');
const router = express.Router();
const express = require('express');
const { body, validationResult } = require('express-validator');

const User = require('../models/userModel');


router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Retrieve a list of all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Retrieve details of a specific user by their ID or username
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const user = await User.findOne({
      $or: [{ _id: identifier }, { username: identifier }]
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update the details of an existing user
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a user from the system
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (user) {
      res.json({ message: 'User deleted' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new post
router.post('/:userId/posts', async (req, res) => {
    try {
      const { userId } = req.params;
      const { title, content, tags } = req.body;
  
      const post = await Post.create({
        title,
        content,
        tags,
        author: userId
      });
  
      const user = await User.findById(userId);
      user.posts.push(post._id);
      await user.save();
  
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Retrieve a list of all posts, sorted by date or popularity
  router.get('/posts', async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: -1 }); // Sort by descending order of createdAt field
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Retrieve details of a specific post by its ID
  router.get('/posts/:postId', async (req, res) => {
    try {
      const { postId } = req.params;
      const post = await Post.findById(postId);
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({ message: 'Post not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Update the details of an existing post
  router.patch('/posts/:postId', async (req, res) => {
    try {
      const { postId } = req.params;
      const { title, content, tags } = req.body;
      const post = await Post.findByIdAndUpdate(postId, { title, content, tags }, { new: true });
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({ message: 'Post not found' });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Delete a post from the system
  router.delete('/posts/:postId', async (req, res) => {
    try {
      const { postId } = req.params;
      const post = await Post.findByIdAndDelete(postId);
      if (post) {
        // Remove the post ID from the author's posts array
        const user = await User.findById(post.author);
        user.posts.pull(postId);
        await user.save();
  
        res.json({ message: 'Post deleted' });
      } else {
        res.status(404).json({ message: 'Post not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create a new comment on a specific post
router.post('/posts/:postId/comments', async (req, res) => {
    try {
      const { postId } = req.params;
      const { content } = req.body;
  
      const comment = await Comment.create({
        content,
        post: postId,
        commenter: req.user._id  // Assuming you have a middleware to authenticate the user and store their ID in req.user
      });
  
      const post = await Post.findById(postId);
      post.comments.push(comment._id);
      await post.save();
  
      res.status(201).json(comment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Retrieve all comments for a specific post
  router.get('/posts/:postId/comments', async (req, res) => {
    try {
      const { postId } = req.params;
      const post = await Post.findById(postId).populate('comments');
      if (post) {
        res.json(post.comments);
      } else {
        res.status(404).json({ message: 'Post not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Retrieve details of a specific comment by its ID
  router.get('/comments/:commentId', async (req, res) => {
    try {
      const { commentId } = req.params;
      const comment = await Comment.findById(commentId);
      if (comment) {
        res.json(comment);
      } else {
        res.status(404).json({ message: 'Comment not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Update the content of an existing comment
  router.patch('/comments/:commentId', async (req, res) => {
    try {
      const { commentId } = req.params;
      const { content } = req.body;
      const comment = await Comment.findByIdAndUpdate(commentId, { content }, { new: true });
      if (comment) {
        res.json(comment);
      } else {
        res.status(404).json({ message: 'Comment not found' });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Delete a comment from the system
  router.delete('/comments/:commentId', async (req, res) => {
    try {
      const { commentId } = req.params;
      const comment = await Comment.findByIdAndDelete(commentId);
      if (comment) {
        // Remove the comment ID from the associated post's comments array
        const post = await Post.findById(comment.post);
        post.comments.pull(commentId);
        await post.save();
  
        res.json({ message: 'Comment deleted' });
      } else {
        res.status(404).json({ message: 'Comment not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  

module.exports = router;
