const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const users_routes = require('./api/routes/users');
const posts_routes = require('./api/routes/posts');
const comments_routes = require('./api/routes/comments');

// 포트 설정
const port = 3008;

// 라우트
app.get("/", (req, res)=>{
    res.send("hello api server is on ready");
})

//cors 허용
app.use(cors({
    origin: "http://125.130.247.176:9002",
    credentials: true
}))

app.use(bodyParser.json());

app.use('/users', users_routes);
app.use('/posts',posts_routes);
app.use('/comments',comments_routes);

// 서버 가동
app.listen(port, () => {
    console.log(`This api server is running on port: ${port}`)
});