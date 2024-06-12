const dbPool = require("../db/db.config");
const { getTime } = require('../utils/util');

module.exports = {
    getAllPosts: async() => {
        const SQL = `select member.nickname, member.profile_image_path, post.id, post.title, date_format(post.updated_at, "%y-%m-%d %h:%m:%s") as updated_at, post.like_count, post.hits_count, post.replys_count from post join member on post.userId = member.id where member.deleted_at is null and post.deleted_at is null`;
        try{
            let results = await dbPool.query(SQL);
            return results[0];
        }
        catch(err){
            return false;
        }
    },
    makePost: async (userId, data) => {
        let id;
        const title = data.title;
        const content = data.content;
        const post_image_path = data.post_image_path;
        const created_at = getTime();
        const updated_at = getTime();
        const deleted_at = null;
        const like_count = 0;
        const hits_count = 0;
        const replys_count = 0;
        try{
            const SQL = `select count(*) from post`;
            const results = await dbPool.query(SQL);
            id = results[0][0]["count(*)"] + 1;
        }
        catch(err){
            console.log(`db error detected in makePost => ${err}`)
            return 0;
        }
        
        try {
            const SQL = `insert into post values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const results = await dbPool.query(SQL, [id, userId, title, content, post_image_path, created_at, updated_at, deleted_at, like_count, hits_count, replys_count]);
            return 1;
        }
        catch (err) {
            console.log(`db error detected in makePost - insert => ${err}`)
            return 0;
        }
    },
    readPost: async (id) => {
        let hits_count;
        try{ // id에 해당하는 게시글의 삭제 여부를 선확인.
            const SQL = `select count(*), hits_count from post where id = ? and deleted_at is null`;
            const results = await dbPool.query(SQL, [id]);
            const result = results[0][0];
            if (result["count(*)"] == 0){
                return -1;
            }
            hits_count = result["hits_count"] + 1;
        }
        catch(err){
            console.log(`db error detected in readPost alive check => ${err}`)
            return 0;
        }

        try{
            const SQL = `select member.nickname, member.profile_image_path, post.id, post.title, post.content, post.post_image_path, date_format(post.updated_at, "%y-%m-%d %h:%m:%s") as updated_at, post.like_count, post.hits_count, post.replys_count from post join member on post.userId = member.id where post.id = ?`;
            let results = await dbPool.query(SQL, [id]);
            results[0][0].hits_count = hits_count;

            const sql = `update post set hits_count = ? where id = ?`;
            const result = await dbPool.query(sql, [hits_count, id]);
            return results[0][0];
        }
        catch(err){
            console.log(`db error detected in readPost read content => ${err}`)
            return 0;
        }
    },
    editPost: async (userId, id, data) => {
        const title = data.title;
        const content = data.content;
        const post_image_path = data.post_image_path;
        try{
            const SQL = `select count(*) from post where id = ? and deleted_at is null`;
            const results = await dbPool.query(SQL, [id]);
            if(results[0][0]["count(*)"] == 0){
                return -1;
            }

            const sql = `select userId from post where id = ?`;
            const result = await dbPool.query(sql, [id]);
            if(result[0][0]["userId"] != userId){
                return -2;
            }
        }
        catch(err){
            console.log(`db error detected in editPost alive & permission check => ${err}`)
            return 0;
        }

        try{
            const SQL = `update post set title = ?, content = ?, post_image_path = ? where id = ?`;
            const results = await dbPool.query(SQL, [title, content, post_image_path, id]);
            return 1;
        }
        catch(err){
            console.log(`db error detected in editPost update => ${err}`)
            return 0;
        }
    },
    deletePost: async (userId, id) => {
        const deleted_at = getTime();
        try{
            const SQL = `select count(*) from post where id = ?`;
            const results =await dbPool.query(SQL, [id]);
            if(results[0][0]["count(*)"] == 0){
                return -1
            }

            const sql = `select userId from post where id = ?`;
            const result = await dbPool.query(sql, [id]);
            if(result[0][0]["userId"] != userId){
                return -2;
            }
        }
        catch(err){
            console.log(`db error detected in deletePost alive & permission check => ${err}`)
            return 0;
        }

        try{
            const SQL = `update post set deleted_at = ? where id = ? `;
            const results = await dbPool.query(SQL, [deleted_at, id]);
            return 1;
        }
        catch(err){
            console.log(`db error detected in deletePost update => ${err}`)
            return 0;
        }
    }
}

function getReplyCount(postId){
    let commentsAll = JSON.parse(fs.readFileSync('/home/app/5-paz-express-all/community_api/api/db/comment.json', 'utf8'));
    const comments = commentsAll.filter(comment => comment.postId == postId && comment.deleted_at == null);
    console.log(comments.length)
    return comments.length;
}