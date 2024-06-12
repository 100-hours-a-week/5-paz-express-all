const model = require('../models/comments.js');

module.exports = {
    // 댓글 조회
    readAllComments: async (req, res) => {
        // 권한 체크
        if (req.session.user == undefined){
            res.status(401).json({"message": "unauthorized"});
        }
        const result = await model.readAllComments(req.params.postId);
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
    makeComment: async (req, res) => {
        // 권한 체크
        if (req.session.user == undefined){
            res.status(401).json({"message": "unauthorized"});
        }
        // req.params.postId, req.body
        const result = await model.makeComment(req.params.postId, req.session.user.id, req.body);
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
    readComment: async (req, res) => {
        const result = await model.readComment(req.session.user.id, req.params.commentId);
        if(result == -1){
            res.status(404).json({"message":"comment_not_found"});
        }
        else if(result == -2){
            res.status(403).json({"message": "permission denied"});
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
    modifyComment: async (req, res) => {
        // 권한 체크
        if (req.session.user == undefined){
            res.status(401).json({"message": "unauthorized"});
        }
        // req.params.commentId, req.body
        const result = await model.modifyComment(req.session.user.id, req.params.commentId, req.body);
        if(result == 1){
            res.status(201).json({"message":"comment_modify_success"});
        }
        else if(result == -2){
            res.status(403).json({"message":"permission denied"});
        }
        else if(result == -1){
            res.status(404).json({"message":"comment_not_found"});
        }
        else{
            res.status(400).json({"message":"comments_modify_failed"});
        }
    },
    // 댓글 삭제
    deleteComment: async (req, res) => {
        // 권한 체크
        if (req.session.user == undefined){
            res.status(401).json({"message": "unauthorized"});
        }
        // req.params.commentId
        const result = await model.deleteComment(req.session.user.id, req.params.commentId);
        if(result == 1){
            res.status(200).json({"message":"comment_delete_success"});
        }
        else if(result == -2){
            res.status(403).json({"message":"permission denied"});
        }
        else if(result == -1){
            res.status(404).json({"message":"comment_not_found"});
        }
        else{
            res.status(400).json({"message":"comment_delete_failed"});
        }

    }
}