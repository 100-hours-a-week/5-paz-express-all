const model = require('../models/comments.js');

module.exports = {
    // 댓글 조회
    readAllComments: (req, res) => {
        // req.params.postId, req.body
        const result = model.readAllComments(req.params.postId, req.body);
        if(result){
            res.status(200).json({
                "message":"all_comments_read_success",
                "data": result
            });
        }
        else if(result == -1){
            res.status(404).json({"message":"post_not_found"});
        }
        else{
            res.status(400).json({"message":"all_comments_read_failed"});
        }
    },
    // 댓글 작성
    makeComment: (req, res) => {
        // req.params.postId, req.body
        const result = model.makeComment(req.params.postId, req.body);
        if(result == 1){
            res.status(201).json({"message":"comment_add_success"});
        }
        else if(result == -1){
            res.status(404).json({"message":"post_not_found"});
        }
        else{
            res.status(400).json({"message":"comment_add_failed"});
        }
    },
    readComment: (req, res) => {
        const result = model.readComment(req.params.commentId);
        if(result == -1){
            res.status(404).json({"message":"comment_not_found"});
        }
        else if(result){
            res.status(200).json({
                "message": "comment_read_success",
                "data": result
            });
        }
        else if(result == 0){
            res.status(400).json({"message":"comment_read_failed"});
        }
    },
    // 댓글 수정
    modifyComment: (req, res) => {
        // req.params.commentId, req.body
        const result = model.modifyComment(req.params.commentId, req.body);
        if(result == 1){
            res.status(201).json({"message":"comment_modify_success"});
        }
        else if(result == -1){
            res.status(404).json({"message":"comment_not_found"});
        }
        else{
            res.status(400).json({"message":"comments_modify_failed"});
        }
    },
    // 댓글 삭제
    deleteComment: (req, res) => {
        // req.params.commentId
        const result = model.deleteComment(req.params.commentId);
        if(result == 1){
            res.status(200).json({"message":"comment_delete_success"});
        }
        else if(result == -1){
            res.status(404).json({"message":"comment_not_found"});
        }
        else{
            res.status(400).json({"message":"comment_delete_failed"});
        }

    }
}