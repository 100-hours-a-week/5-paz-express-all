const express = require("express");
const router = express.Router();

const {readAllComments, makeComment, readComment, modifyComment, deleteComment} = require("../controllers/comments");

router.get('/:postId', readAllComments);

router.post('/:postId', makeComment);

router.get('/one/:commentId', readComment)

router.put('/:commentId', modifyComment);

router.delete('/:commentId', deleteComment);

module.exports = router;