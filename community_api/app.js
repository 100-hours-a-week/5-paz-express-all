const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const users_routes = require('./api/routes/users');
const posts_routes = require('./api/routes/posts');
const comments_routes = require('./api/routes/comments');


// 포트 설정
const port = 3008;

//cors 허용
app.use(cors({
    origin: "http://localhost:9002",
    credentials: true
}))

// 세션 기본 설정
app.use(session({
    secret: 'topazkang',
    saveUninitialized: true,
    resave: false,
    cookie: {
        httpOnly: true,
    }
}));

// 라우트
app.get("/", (req, res)=>{
    res.send("hello api server is on ready");
})



app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true, limit: '50mb', parameterLimit: 500000}));
app.use(express.text({limit: '50mb'}));

app.use('/users', users_routes);
app.use('/posts',posts_routes);
app.use('/comments',comments_routes);

// 서버 가동
app.listen(port, () => {
    console.log(`This api server is running on port: ${port}`)
});