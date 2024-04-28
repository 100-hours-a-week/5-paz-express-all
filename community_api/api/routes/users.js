const express = require("express");
const router = express.Router();

const {login, logout, signin, emailChk, 
    nicknameChk, getInfo, modifyInfo, 
    changePassword, deleteUser} = require("../controllers/users");

router.post('/login', login);

router.post('/:userId/logout', logout);

router.post('/', signin);

router.get('/email', emailChk);

router.get('/nickname', nicknameChk);

router.get('/:userId', getInfo);

router.patch('/:userId', modifyInfo);

router.put('/:userId', changePassword);

router.delete('/:userId', deleteUser);

module.exports = router;