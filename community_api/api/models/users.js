const dbPool = require("../db/db.config");
const { getTime } = require('../utils/util');

module.exports = {
    // 로그인
    login: async (data) => { // data.email, data.password
        // data.email을 기준으로 db의 레코드에서 비밀번호 조회
        // 조회되는 레코드가 없으면 -1
        // 비밀번호가 일치하지 않으면 0
        // 일치하면 id랑 프로필 이미지 조회값 반환
        try{
            const SQL = `select id, password, profile_image_path from member where email = ? and deleted_at is null`;
            const results = await dbPool.query(SQL, [data.email]);
            if(results[0][0]["password"] == data.password){
                const info = {};
                info.id = results[0][0]["id"];
                info.profile_image_path = results[0][0]["profile_image_path"];
                return info;
            }
            else{
                return 0;
            }
        }
        catch(err){
            console.log(`db error detected on login => ${err}`)
            return -1;
        }
    },
    // 회원가입
    signin: async (info) => { // info => email/nickname/password/proile_image_path & id = count+1/ created_at&updated_at = time/ deleted_at = null
        let id;
        const nickname = info.nickname;
        const email = info.email;
        const password = info.password;
        const profile_image_path = info.profile_image_path;
        const created_at = getTime();
        const updated_at = getTime();
        const deleted_at = null;

        try{
            const SQL = `select count(*) from member`;
            const results = await dbPool.query(SQL);
            id = results[0][0]["count(*)"]+1;
        }
        catch(err){
            console.log(`db error detected on signin model - count => ${err}`)
            return false;
        }
        
        try{
            const SQL = `insert into member values(?, ?, ?, ?, ?, ?, ?, ?)`;
            const results = await dbPool.query(SQL,[id, nickname, email, password, profile_image_path, created_at, updated_at, deleted_at]);
            console.log(results);
            return true;
        }
        catch(err){
            console.log(`db error detected on signin model - insert => ${err}`)
            return false;
        }

    },
    // 이메일 중복체크
    emailChk: async(email) => {
        const SQL = `select count(*) from member where email = ?`;
        try{
            const results = await dbPool.query(SQL, [email]);
            console.log(results[0][0]["count(*)"])
            count = results[0][0]["count(*)"];
            if(count == 0){
                return false;
            }
            else if(count > 0){
                return true;
            }
        }
        catch(err){
            console.log(`db error detected on emailChk model => ${err}`)
            return true;
        }
    },
    // 닉네임 중복체크
    nicknameChk: async(nickname) => {
        const SQL = `select count(*) from member where nickname = ?`;
        try{
            const results = await dbPool.query(SQL, [nickname]);
            const count = results[0][0]["count(*)"];
            if(count == 0){
                return false;
            }
            else if(count > 0){
                return true;
            }
        }
        catch(err){
            console.log(`db error detected on emailChk model => ${err}`)
            return true;
        }
    },
    //id 기준 정보 조회
    readInfo: async (id) => {
        const SQL = `select email, nickname, profile_image_path from member where id = ?`;
        try{
            const results = await dbPool.query(SQL, [id]);
            const info = {};
            info.email = results[0][0]["email"];
            info.nickname = results[0][0]["nickname"];
            info.profile_image_path = [0][0]["profile_image_path"];
            return info;
        }
        catch(err){
            console.log(`db error detected in readInfo by id model => ${err}`)
            return false;
        }
    },
    modifyInfo: async (id, data) => { // id data.nickname data.profile_image 없거나 삭제되어있으면 -1 안맞으면 0 update 갯수로 구분하려 했으나 예외 상황을 거를수가 없음.
        const SQL = `update member set nickname = ?, profile_image_path = ? where id = ?`;
        try{
            const results = await dbPool.query(SQL,[data.nickname, data.profile_image_path, id]);
            return 1;
        }
        catch(err){
            console.log(`db error detected in modifyInfo => ${err}`);
            return 0;
        }
    },
    changePassword: async (id, password) => {
        const SQL = `update member set password = ? where id = ?`;
        try{
            const results = await dbPool.query(SQL, [password, id]);
            return 1;
        }
        catch(err){
            console.log(`db error detected in changePassword => ${err}`);
            return 0;
        }
    },
    deleteUser: async (id) => {
        console.log(id)
        const deleted_at = getTime();
        const SQL = `update member set deleted_at = ? where id = ?`;
        try{
            const results = await dbPool.query(SQL, [deleted_at, id]);
            return 1;
        }
        catch(err){
            console.log(`db error detected in deleteUser => ${err}`);
            return 0;
        }
    }
}

// db 연관관계 제거용 함수
function deleteRelative(id, dbR, name) {
    const posts_index = [];
    dbR.forEach((post, index) => {
        if (id == post.userId) {
            posts_index.push(index);
        }
    });

    posts_index.forEach((index) => {
        let tmp = dbR.splice(index, 1);
        tmp[0].deleted_at = getTime();
        dbR.splice(index, 0, tmp[0]);
        fs.writeFileSync(`/home/app/5-paz-express-all/community_api/api/db/${name}.json`, JSON.stringify(dbR), 'utf8');
    })
}