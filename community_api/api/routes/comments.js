const express = require("express");
const router = express.Router();

const {readAllComments, makeComment, readComment, modifyComment, deleteComment} = require("../controllers/comments");

router.get('/:postId', readAllComments);

router.post('/:postId', makeComment);  //req.session.user.id

router.get('/one/:commentId', readComment) 

router.put('/:commentId', modifyComment); //req.session.user.id

router.delete('/:commentId', deleteComment); // req.session.user.id

module.exports = router;