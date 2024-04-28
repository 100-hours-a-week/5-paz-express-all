const model = require("../models/posts.js");

module.exports = {
    getAllPosts: async (req, res) => {
        const result = await model.getAllPosts();
        console.log(result)
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
    makePost: (req, res) => {
        const result = model.makePost(req.body);
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
    readPost: (req, res) => {
        const result = model.readPost(req.params.postId);
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
    editPost: (req, res) => {
        const result = model.editPost(req.params.postId, req.body);
        if (result == 1) {
            res.status(201).json({ "message": "post_modify_success" });
        }
        else if (result == -1) {
            res.status(404).json({ "message": "post_not_found" });
        }
        else {
            res.status(400).json({ "message": "post_modify_failed" });
        }
    },
    deletePost: (req, res) => {
        const result = model.deletePost(req.params.postId);
        if (result == 1) {
            res.status(200).json({ "message": "post_delete_success" });
        }
        else if (result == -1) {
            res.status(404).json({ "message": "post_not_found" });
        }
        else {
            res.status(400).json({ "message": "post_delete_failed" });
        }
    }
}