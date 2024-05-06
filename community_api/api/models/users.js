const fs = require('fs');
const db = require('../db/member.json');
const post_db = require('../db/post.json');
const comment_db = require('../db/comment.json');
const { getTime } = require('../utils/util');

module.exports = {
    // 로그인
    login: (data) => {
        const members = db.find(member => member.email == data.email);
        if (members !== undefined && !members.deleted_at) {
            if (data.password == members.password) {
                return { "id": members.id, "path": members.profile_image_path };
            }
            else {
                return 0;
            }
        }
        else{
            return -1;
        }
    },
    // 회원가입
    signin: (info) => {
        try {
            let member = JSON.parse(fs.readFileSync('/home/app/5-paz-express-all/community_api/api/db/member.json', 'utf8'));
            const time = getTime();
            info.id = member.length + 1;
            info.created_at = time;
            info.updated_at = time;
            info.deleted_at = null;
            console.log(info)
            member.push(info);
            fs.writeFileSync('/home/app/5-paz-express-all/community_api/api/db/member.json', JSON.stringify(member), 'utf8');
            return true;
        } catch (err) {
            console.log(`error occured in users_model_signin: ${err}`)
            return false;
        }
    },
    // 이메일 중복체크
    emailChk: (email) => {
        let members = db.find(member => member.email == email);
        if (members) {
            return true;
        }
        else {
            return false;
        }
    },
    // 닉네임 중복체크
    nicknameChk: (nickname) => {
        let members = db.find(member => member.nickname == nickname);
        if (members) {
            return true;
        }
        else {
            return false;
        }
    },
    //id 기준 정보 조회
    readInfo: (id) => {
        const members = db.find(member => member.id == id);
        if (members) {
            const info = {};
            info.id = members.id;
            info.nickname = members.nickname;
            info.profile_image_path = members.profile_image_path;
            info.email = members.email;
            return info;
        }
        else {
            return false;
        }
    },
    modifyInfo: (id, data) => {
        console.log(id, data)
        let members = JSON.parse(fs.readFileSync('/home/app/5-paz-express-all/community_api/api/db/member.json', 'utf8'));
        let member = db.find(member => member.id == id);
        if (member !== undefined && !member.deleted_at) {
            try {
                let index = members.findIndex(member => member.id == id);
                let temp = members.splice(index, 1);
                if (data.profile_image) {
                    temp[0].profile_image_path = data.profile_image;
                }
                if (data.nickname) {
                    temp[0].nickname = data.nickname;
                }
                temp[0].updated_at = getTime();
                members.splice(index, 0, temp[0]);
                fs.writeFileSync('/home/app/5-paz-express-all/community_api/api/db/member.json', JSON.stringify(members), 'utf8');
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
    changePassword: (id, password) => {
        let members = JSON.parse(fs.readFileSync('/home/app/5-paz-express-all/community_api/api/db/member.json', 'utf8'));
        let member = db.find(member => member.id == id);
        if (member !== undefined && !member.deleted_at) {
            try {
                let index = members.findIndex(member => member.id == id);
                let temp = members.splice(index, 1);
                temp[0].updated_at = getTime();
                temp[0].password = password;
                members.splice(index, 0, temp[0]);
                fs.writeFileSync('/home/app/5-paz-express-all/community_api/api/db/member.json', JSON.stringify(members), 'utf8');
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
    deleteUser: (id) => {
        let members = JSON.parse(fs.readFileSync('/home/app/5-paz-express-all/community_api/api/db/member.json', 'utf8'));
        let member = db.find(member => member.id == id);
        if (member !== undefined && !member.deleted_at) {
            try {
                let index = members.findIndex(member => member.id == id);
                let temp = members.splice(index, 1);
                console.log(temp)
                temp[0].deleted_at = getTime();
                members.splice(index, 0, temp[0]);
                fs.writeFileSync('/home/app/5-paz-express-all/community_api/api/db/member.json', JSON.stringify(members), 'utf8');

                // 연관관계 DB 제거
                deleteRelative(id, post_db, "post");
                deleteRelative(id, comment_db, "comment");

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

// db 연관관계 제거용 함수
function deleteRelative(id, dbR, name) {
    const posts_index = [];
    dbR.forEach((post, index) => {
        if (id == post.userId){
            posts_index.push(index);
        }
    });

    posts_index.forEach((index) => {
        let tmp = dbR.splice(index, 1);
        tmp[0].deleted_at = getTime();
        dbR.splice(index, 0 ,tmp[0]);
        fs.writeFileSync(`/home/app/5-paz-express-all/community_api/api/db/${name}.json`, JSON.stringify(dbR),'utf8');
    })
}