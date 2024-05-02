const fs = require('fs');
const db = require('../db/post.json');
const member_db = require('../db/member.json');
const comment_db = require('../db/comment.json');
const { getTime } = require('../utils/util');

module.exports = {
    getAllPosts: async() => {
        const posts = db.filter(post => post.deleted_at == null);
        try{
            posts.forEach(post => {
                const member = member_db.find(member => member.id == post.userId);
                post.nickname = member.nickname;
                post.profile_image_path = member.profile_image_path;
            });
            console.log(posts);
            return posts;
            
        }
        catch(err){
            console.log(err)
            return 0;
        }
    },
    makePost: (data) => {
        let posts = JSON.parse(fs.readFileSync('/home/app/community_api/api/db/post.json', 'utf8'));
        try {
            data.created_at = getTime();
            data.updated_at = getTime();
            data.deleted_at = null;
            data.id = posts.length + 1;
            data.like_count = 0;
            data.hits_count = 0;
            data.replys_count = 0
            console.log(data)
            // db는 전역변수 생길 수 있는 문제를 고민해볼것.
            posts.push(data);
            fs.writeFileSync('/home/app/community_api/api/db/post.json', JSON.stringify(posts), 'utf8');
            return 1;
        }
        catch (err) {
            return 0;
        }
    },
    readPost: (id) => {
        let postsAll = JSON.parse(fs.readFileSync('/home/app/community_api/api/db/post.json', 'utf8'));
        const posts = postsAll.find(post => post.id == id);
        if (posts !== undefined && !posts.deleted_at) {
            try {
                const index = postsAll.findIndex(post => post.id == id);
                const temp = postsAll.splice(index, 1);
                temp[0].replys_count = getReplyCount(id);
                temp[0].hits_count += 1;
                postsAll.splice(index, 0, temp[0]);
                fs.writeFileSync('/home/app/community_api/api/db/post.json', JSON.stringify(postsAll), 'utf8');
                
                // 유저 닉네임 정보 추가
                const member = member_db.find(member => member.id == temp[0].userId);
                temp[0].nickname = member.nickname;
                temp[0].profile_image_path = member.profile_image_path;
                return temp[0];
            }
            catch (err) {
                console.log(err)
                return 0;
            }
        }
        else {
            return -1;
        }
    },
    editPost: (id, data) => {
        let postsAll = JSON.parse(fs.readFileSync('/home/app/community_api/api/db/post.json', 'utf8'));
        const posts = postsAll.find(post => post.id == id);
        if (posts !== undefined && !posts.deleted_at) {
            try {
                const index = postsAll.findIndex(post => post.id == id);
                const temp = postsAll.splice(index, 1);
                if (data.title) {
                    temp[0].title = data.title;
                }           
                if (data.content) {
                    temp[0].content = data.content;
                }
                if (data.post_image_path) {
                    temp[0].post_image_path = data.post_image_path;
                }
                temp[0].updated_at = getTime();
                postsAll.splice(index, 0, temp[0]);
                fs.writeFileSync('/home/app/community_api/api/db/post.json', JSON.stringify(postsAll), 'utf8');
                return 1;
            }
            catch (err) {
                console.log(err)
                return 0;
            }
        }
        else {
            return -1;
        }
    },
    deletePost: (id) => {
        let postsAll = JSON.parse(fs.readFileSync('/home/app/community_api/api/db/post.json', 'utf8'));
        const posts = postsAll.find(post => post.id == id);
        if (posts !== undefined && !posts.deleted_at) {
            try {
                const index = postsAll.findIndex(post => post.id == id);
                const temp = postsAll.splice(index, 1);
                temp[0].deleted_at = getTime();
                postsAll.splice(index, 0, temp[0]);
                fs.writeFileSync('/home/app/community_api/api/db/post.json', JSON.stringify(postsAll), 'utf8');
                return 1;
            }
            catch (err) {
                console.log(err)
                return 0;
            }
        }
        else {
            return -1;
        }
    }
}

function getReplyCount(postId){
    const comments = comment_db.filter(comment => comment.postId == postId && comment.deleted_at == null);
    return comments.length;
}