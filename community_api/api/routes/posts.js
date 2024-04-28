const express = require("express");
const router = express.Router();

const {getAllPosts, makePost, readPost, editPost, deletePost} = require('../controllers/posts.js');

router.get('/', getAllPosts);

router.post('/', makePost);

router.get('/:postId', readPost);

router.patch('/:postId', editPost);

router.delete('/:postId', deletePost);

module.exports = router;