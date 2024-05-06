const fs = require('fs');
const db = require('../db/comment.json');
const member_db = require('../db/member.json')
const { getTime } = require('../utils/util.js');

module.exports = {
    readAllComments: (postId) => {
        let commentsAll = JSON.parse(fs.readFileSync('/home/app/5-paz-express-all/community_api/api/db/comment.json', 'utf8'));
        const comments = commentsAll.filter(comment => comment.postId == postId && comment.deleted_at == null);
        try{
            comments.forEach(comment => {
                const member = member_db.find(member => member.id == comment.userId);
                comment.nickname = member.nickname;
                comment.profile_image_path = member.profile_image_path;
            })
            return comments
        }
        catch(err){ 
            console.log(err)
            return 0;
        }
    },
    makeComment: (postId, userId, data) => {
        let comments = JSON.parse(fs.readFileSync('/home/app/5-paz-express-all/community_api/api/db/comment.json', 'utf8'));
        try {
            data.postId = postId;
            data.id = comments.length + 1;
            data.userId = userId;
            data.created_at = getTime();
            data.updated_at = getTime();
            data.deleted_at = null;
            comments.push(data);
            fs.writeFileSync('/home/app/5-paz-express-all/community_api/api/db/comment.json',JSON.stringify(comments),'utf8');

            return 1;
        }
        catch (err) {
            console.log(err)
            return 0;
        }
    },
    readComment: (commentId) => {
        let commentsAll = JSON.parse(fs.readFileSync('/home/app/5-paz-express-all/community_api/api/db/comment.json', 'utf8'));
        const comment = commentsAll.find(comment => comment.id == commentId);
        if(comment !== undefined && !comment.deleted_at){
            try{
                const member = member_db.find(member => member.id == comment.userId);
                comment.nickname = member.nickname;
                comment.profile_image_path = member.profile_image_path;
                return comment;
            }
            catch(err){
                console.log(err)
                return 0;
            }
        }
        else{
            return -1;
        }

    },
    modifyComment: (commentId, data) => {
        let commentsAll = JSON.parse(fs.readFileSync('/home/app/5-paz-express-all/community_api/api/db/comment.json', 'utf8'));
        const comments = commentsAll.find(comment => comment.id == commentId);
        if(comments !== undefined && !comments.deleted_at){
            try{
                const index = commentsAll.findIndex(comment => comment.id == commentId);
                const temp = commentsAll.splice(index, 1);
                if(data.comment){
                    temp[0].comment = data.comment;
                }
                temp[0].updated_at = getTime();
                commentsAll.splice(index, 0, temp[0]);
                fs.writeFileSync('/home/app/5-paz-express-all/community_api/api/db/comment.json', JSON.stringify(commentsAll), 'utf8');
                return 1;
            }
            catch(err) {
                console.log(err)
                return 0;
            }
        }
        else{
            return -1
        }
    },
    deleteComment: (commentId) => {
        let commentsAll = JSON.parse(fs.readFileSync('/home/app/5-paz-express-all/community_api/api/db/comment.json', 'utf8'));
        const comment = commentsAll.find(comment => comment.id == commentId);
        if(comment !== undefined && !comment.deleted_at) {
            try{
                const index = commentsAll.findIndex(comment => comment.id == commentId);
                const temp = commentsAll.splice(index, 1);
                temp[0].deleted_at = getTime();
                commentsAll.splice(index, 0, temp[0]);
                fs.writeFileSync('/home/app/5-paz-express-all/community_api/api/db/comment.json', JSON.stringify(commentsAll), 'utf8');
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