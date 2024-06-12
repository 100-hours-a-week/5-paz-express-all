const express = require("express");
const router = express.Router();

const {login, logout, signin, emailChk, 
    nicknameChk, getInfo, modifyInfo, 
    changePassword, deleteUser} = require("../controllers/users");

router.post('/login', login);

router.post('/logout', logout);

router.post('/', signin);

router.get('/email', emailChk);

router.get('/nickname', nicknameChk);

router.get('/', getInfo);

router.patch('/', modifyInfo);

router.put('/', changePassword);

router.delete('/', deleteUser);

module.exports = router;