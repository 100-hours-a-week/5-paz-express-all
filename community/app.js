import express from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';
const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 웹서버 서비스를 위함.
app.use(express.static("public"));
// 파일 업로드를 위한 세팅
app.use(fileUpload());


// 로그인 페이지
app.get('/community', (req, res) => {
	res.sendFile(__dirname+"/public/login/login.html")
});
//회원가입 페이지
app.get('/community/signin',(req, res) => {
	res.sendFile(__dirname+"/public/signin/signin.html")
});
// 메인 페이지(게시글 리스트 조회)
app.get('/community/main', (req, res) => {
	res.sendFile(__dirname+"/public/main/main/main.html")
});
// 게시글 상세 조회
app.get('/community/post/:postid', (req, res) => {
	res.sendFile(__dirname+"/public/main/readPost/post.html")
});
// 게시글 작성
app.get('/community/makepost', (req, res) => {
	res.sendFile(__dirname+"/public/main/makePost/makePost.html")
});
// 게시글 수정
app.get('/community/editpost/:postid', (req, res) => {
	res.sendFile(__dirname+"/public/main/editPost/editPost.html")
});
// 게시글 삭제 여부 재확인
app.get('/community/checkcontent/:postid', (req, res) => {
	res.sendFile(__dirname+"/public/main/modal/deleteContent.html")
});
// 댓글 삭제 여부 재확인
app.get('/community/checkreply/:commentid', (req, res) => {
	res.sendFile(__dirname+"/public/main/modal/deleteReply.html")
});
// 개인정보 수정(닉네임, 사진)
app.get('/community/profile', (req, res) => {
	res.sendFile(__dirname+"/public/profile/editProfile/editProfile.html")
});
// 비밀번호 수정
app.get('/community/password', (req, res) => {
	res.sendFile(__dirname+"/public/profile/editPassword/editPassword.html")
});
// 회원 탈퇴
app.get('/community/checkdrop', (req, res) => {
	res.sendFile(__dirname+"/public/profile/modal/deleteCheck.html")
});


// 파일 업로드 api
app.post('/upload', (req, res) => {
	// 현재 시간
	let now = new Date();
    let yy = now.getFullYear();
    let mm = ('0' + (now.getMonth() + 1)).slice(-2);
    let dd = ('0' + now.getDate()).slice(-2);
    let hh = ('0' + now.getHours()).slice(-2);
    let min = ('0' + now.getMinutes()).slice(-2);
    let ss = ('0' + now.getSeconds()).slice(-2);

    const time = `${yy}-${mm}-${dd}_${hh}:${min}:${ss}`

	// 변수명을 시간으로 하여금 저장
	let uploadFile = req.files.file;
	let uploadFileName = req.files.file.name;
	const uploadPath = "/assets/files/"+time+uploadFileName;
	uploadFile.mv(
		`${__dirname}/public/assets/files/${time}${uploadFileName}`,
		async function (err) {
			if (err) {
				return res.status(500).send(err);
			}
			let body = JSON.stringify({"path":uploadPath});
			res.send(body);
		}
	);
});

app.listen(port, () => {
	console.log(`community is listening on port ${port}`)
});
