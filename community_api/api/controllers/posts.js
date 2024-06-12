const model = require("../models/posts.js");

module.exports = {
    getAllPosts: async (req, res) => {
        // 권한 체크
        if (req.session.user == undefined){
            res.status(401).json({"message": "unauthorized"});
        }
        const result = await model.getAllPosts();
        if (result) {
            res.status(200).json({
                "message": "posts_read_success",
                "data": result
            });
        }
        else {
            res.status(400).json({ "message": "posts_read_failed" });
        }
    },
    makePost: async (req, res) => {
        // 권한 체크
        if (req.session.user == undefined){
            res.status(401).json({"message": "unauthorized"});
        }
        const result = await model.makePost(req.session.user.id, req.body);
        if (result == 1) {
            res.status(201).json({ "message": "post_create_success" });
        }
        else if (result == -1) {
            res.status(404).json({ "message": "user_not_found" });
        }
        else {
            res.status(400).json({ "message": "post_create_failed" });
        }
    },
    readPost: async (req, res) => {
        // 권한 체크
        if (req.session.user == undefined){
            res.status(401).json({"message": "unauthorized"});
        }
        const result = await model.readPost(req.params.postId);
        if (result == -1) {
            res.status(404).json({ "message": "post_not_found" });
        }
        else if (result) {
            res.status(200).json({
                "message": "post_read_success",
                "data": result
            });
        }
        else {
            res.status(400).json({ "message": "post_read_failed" });
        }
    },
    editPost: async (req, res) => {
        // 권한 체크
        if (req.session.user == undefined){
            res.status(401).json({"message": "unauthorized"});
        }
        const result = await model.editPost(req.session.user.id ,req.params.postId, req.body);
        if (result == 1) {
            res.status(201).json({ "message": "post_modify_success" });
        }
        else if (result == -2){
            res.status(403).json({"message": "permission denied"});
        }
        else if (result == -1) {
            res.status(404).json({ "message": "post_not_found" });
        }
        else {
            res.status(400).json({ "message": "post_modify_failed" });
        }
    },
    deletePost: async (req, res) => {
        // 권한 체크
        if (req.session.user == undefined){
            res.status(401).json({"message": "unauthorized"});
        }
        const result = await model.deletePost(req.session.user.id ,req.params.postId);
        if (result == 1) {
            res.status(200).json({ "message": "post_delete_success" });
        }
        else if (result == -2){
            res.status(403).json({"message": "permission denied"});
        }
        else if (result == -1) {
            res.status(404).json({ "message": "post_not_found" });
        }
        else {
            res.status(400).json({ "message": "post_delete_failed" });
        }
    }
}