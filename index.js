// express 모듈을 사용하겠다
const express = require('express');
// 익스프레스 함수를 사용하겠다
const app = express();
// 포트는 3005을 사용
const port = 3005;
// 바디파서를 사용하겠다
const bodyParser = require('body-parser');
const config = require('./config/key');
const { User } = require('./models/User');

// bodyParser가 application/x-www-form-urlencoded 데이터를 분석해서 가져옴.
app.use(bodyParser.urlencoded({extended: true}));
// bodyParser가 json 데이터를 분석해서 가져옴.
app.use(bodyParser.json());

// 몽구스 모듈을 사용하겠다
const mongoose = require('mongoose');
// 이 저장소를 연결하겠다, 옵션을 추가하겠다
// 파일을 배포했을 때 mongoURI까지 배포되지 않도록 변수를 받아옴
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...')).catch(err => console.log(err));

app.get('/', (req, res) => res.send('오늘도 모험을 떠나요.'));

// register router
app.post('/register', (req, res) => {
    // 회원가입 할 때 필요한 정보들을 client에서 가져오면
    const user = new User(req.body);
    // 몽고DB에 담는다(save)
    user.save((err, userInfo) => {
        if (err) return res.json({success: false, err});
        return res.status(200).json({success:true});
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));