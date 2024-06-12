const dbPool = require("../db/db.config.js");
const { getTime } = require('../utils/util.js');

module.exports = {
    readAllComments: async (postId) => {
        try{
            const SQL = `select count(*) from post where id = ?`;
            const results = await dbPool.query(SQL,[postId]);
            if(results[0][0]["count(*)"] == 0){
                return -1;
            }
        }
        catch(err){
            console.log(`db error detected in readAllComments post alive check => ${err}`)
            return 0;
        }

        try{
            const SQL = `select member.nickname, member.profile_image_path, comment.id, date_format(comment.updated_at, "%y-%m-%d %h:%m:%s") as updated_at, comment.comment from comment join member on comment.userId = member.id where comment.postId = ?`;
            const results = await dbPool.query(SQL, [postId]);
            return results[0];
        }
        catch(err){
            console.log(`db error detected in readAllComments => ${err}`)
            return 0;
        }
    },
    makeComment: async (postId, userId, data) => {
        let id;
        const comment = data.comment;
        const created_at = getTime();
        const updated_at = getTime();
        const deleted_at = null;
        let counter;
        try{
            const SQL = `select count(*) from post where id = ?`;
            const results = await dbPool.query(SQL,[postId]);
            if(results[0][0]["count(*)"] == 0){
                return -1;
            }
            counter = results[0][0]["count(*)"] + 1;

            const sql = `select count(*) from comment`; // id 값을 입력하기 위함
            const count = await dbPool.query(sql);
            id = count[0][0]["count(*)"] + 1;
        }
        catch(err){
            console.log(`db error detected in makeComment post alive check => ${err}`)
            return 0;
        }

        try{
            const SQL = `insert into comment values (?, ?, ?, ?, ?, ?, ?)`;
            const results = await dbPool.query(SQL, [id, postId, userId, comment, created_at, updated_at, deleted_at]);

            const sql = `update post set replys_count = ? where id = ?`;
            const result = await dbPool.query(sql, [counter, postId]);
            return 1;
        }
        catch(err){
            console.log(`db error detected in makeComment insert => ${err}`)
            return 0;
        }
    },
    readComment: async (userId, commentId) => {
        try{
            const SQL = `select count(*) from comment where id = ?`;
            const results = await dbPool.query(SQL, [commentId]);
            if(results[0][0]["comment(*)"] == 0){
                return -1;
            }

            const sql = `select userId from comment where id = ?`;
            const result = await dbPool.query(sql, [commentId]);
            if(result[0][0]["userId"] != userId){
                return -2; // 권한 부족
            }
        }
        catch(err){
            console.log(`db error detected in readComment alive check => ${err}`);
            return 0;
        }

        try{
            const SQL = `select id, comment from comment where id = ?`;
            const results = await dbPool.query(SQL, [commentId]);
            return results[0][0];
        }
        catch(err){
            console.log(`db error detected in readComment read => ${err}`)
            return 0;
        }
    },
    modifyComment: async (userId, commentId, data) => {
        const comment = data.comment;
        const updated_at = getTime();
        try{
            const SQL = `select count(*) from comment where id = ?`;
            const results = await dbPool.query(SQL, [commentId]);
            if(results[0][0]["comment(*)"] == 0){
                return -1;
            }

            const sql = `select userId from comment where id = ?`;
            const result = await dbPool.query(sql, [commentId]);
            if(result[0][0]["userId"] != userId){
                return -2; // 권한 부족
            }
        }
        catch(err){
            console.log(`db error detected in modifyComment alive check => ${err}`);
            return 0;
        }

        try{
            const SQL = `update comment set comment = ?, updated_at = ? where id = ?`;
            const results = await dbPool.query(SQL, [comment, updated_at, commentId]);
            return 1;
        }
        catch(err){
            console.log(`db.error detected in modifyComment update => ${err}`);
            return 0;
        }
    },
    deleteComment: async (userId, commentId) => {
        const deleted_at = getTime();
        try{
            const SQL = `select count(*) from comment where id = ?`;
            const results = await dbPool.query(SQL, [commentId]);
            if(results[0][0]["comment(*)"] == 0){
                return -1;
            }

            const sql = `select userId from comment where id = ?`;
            const result = await dbPool.query(sql, [commentId]);
            if(result[0][0]["userId"] != userId){
                return -2; // 권한 부족
            }
        }
        catch(err){
            console.log(`db error detected in modifyComment alive check => ${err}`);
            return 0;
        }

        try{
            const SQL = `update comment set deleted_at = ? where id = ?`;
            const results = await dbPool.query(SQL, [deleted_at, commentId]);
            return 1;
        }
        catch(err){
            console.log(`db error detected in deleteComment delete => ${err}`)
            return 0;
        }
    }
}