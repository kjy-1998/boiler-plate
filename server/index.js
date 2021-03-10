// express 모듈을 사용하겠다
const express = require('express');
// 익스프레스 함수를 사용하겠다
const app = express();
// 포트는 3100을 사용
const port = 3100;
// 바디파서를 사용하겠다
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const {
    auth
} = require('./middleware/auth');
const {
    User
} = require('./models/User');

// bodyParser가 application/x-www-form-urlencoded 데이터를 분석해서 가져옴.
app.use(bodyParser.urlencoded({
    extended: true
}));
// bodyParser가 json 데이터를 분석해서 가져옴.
app.use(bodyParser.json());
app.use(cookieParser());

// 몽구스 모듈을 사용하겠다
const mongoose = require('mongoose');
// 이 저장소를 연결하겠다, 옵션을 추가하겠다
// 파일을 배포했을 때 mongoURI까지 배포되지 않도록 변수를 받아옴
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('MongoDB Connected...')).catch(err => console.log(err));

app.get('/', (req, res) => res.send('오늘도 모험을 떠나요.'));
// register router(엔드포인트 register)
app.post('/api/users/register', (req, res) => {
    // 회원가입 할 때 필요한 정보들을 client에서 가져오면
    const user = new User(req.body);
    // 몽고DB에 담는다(save)
    user.save((err, userInfo) => {
        if (err) return res.json({
            success: false,
            err
        });
        return res.status(200).json({
            success: true
        });
    });
});
// login router(엔드포인트 login)
app.post('/api/users/login', (req, res) => {
    // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({
        email: req.body.email
    }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: '제공된 이메일에 해당하는 유저가 없습니다.'
            });
        }
        // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인(User.js에서 생성된 메서드임)
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) {
                return res.json({
                    loginSuccess: false,
                    message: '비밀번호가 틀렸습니다.'
                });
            }
            // 비밀번호까지 맞다면 토큰을 생성하기.
            user.generateToken((err, user) => {
                if (err) {
                    return res.status(400).send(err);
                }
                // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지
                // 쿠키 name, value형태로 저장
                res.cookie('x_auth', user.token)
                    .status(200)
                    .json({
                        loginSuccess: true,
                        userId: user._id
                    });
            });
        });
    });
});
app.get('/api/users/auth', auth, (req, res) => {
    // 여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True라는 말.
    // if문을 통과했기 때문
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    });
});
// 로그인 된 상태에서 DB 토큰을 지워주면 
// 클라이언트 토큰 != DB 토큰 이므로 로그인 실패함. 즉 로그아웃
app.get('/api/users/logout', auth, (req, res) => {
    // id값을 찾아서 token을 ''로 지워줌
    User.findOneAndUpdate({
            _id: req.user._id
        }, {
            token: ''
        },
        (err, user) => {
            if (err) return res.json({
                success: false,
                err
            });
            return res.status(200).send({
                success: true
            });
        }
    )
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));