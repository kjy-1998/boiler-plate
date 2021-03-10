const mongoose = require('mongoose');
// 비밀번호 암호화 라이브러리 사용
const bcrypt = require('bcrypt');
// 암호화에 필요한 salt를 10글자로 만들겠다.
const saltRounds = 10;
// 웹 토큰 라이브러리 사용
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    },
    email: {
        type: String,
        // 공백을 없애줌
        trim: true,
        unique: 1,
    },
    password: {
        type: String,
        minlength: 5,
    },
    lastname: {
        type: String,
        maxlength: 50,
    },
    role: {
        type: Number,
        // 지정하지 않으면 기본값으로 0을 줌
        default: 0
    },
    // 이렇게도 가능
    image: String,
    token: {
        type: String,
    },
    // 토큰 유효기간
    tokenExp: {
        type: Number,
    }
});

// mongoose 메소드로 'save'를 실행하기 전에(pre) 어떤 행동을 하겠다.
userSchema.pre('save', function (next) {
    let user = this;
    // password가 변경될 때만 암호화 시킨다
    if (user.isModified('password')) {
        // salt를 생성(gen), 이용해서 비밀번호를 암호화
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);
            // user.password => 암호화 전 값
            // hash => 암호화 이후 값
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;

                next();
            });
        });
        // passwrod가 변경되지 않을 때는 바로 'save'를 실행하겠다
    } else {
        next();
    }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
    //plainPassword: 1234567 == 암호화된 비밀번호: $2b$10$1492vQ0M4s9YUBfwYkkaZ0gl
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
}

userSchema.methods.generateToken = function (cb) {
    // jsonwebtoken을 이용해서 token을 생성하기
    let user = this;
    // token과 secretToken을 넣었을 때 user._id를 알 수 있다.
    let token = jwt.sign(user._id.toHexString(), 'secretToken');
    user.token = token;
    user.save(function (err, user) {
        if (err) return cb(err);
        cb(null, user);
    });
}

// findByToken 메서드 생성
userSchema.statics.findByToken = function(token, cb) {
    let user = this;
    // 토큰을 decode(복호화) 한다.
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
        user.findOne({'_id': decoded, 'token':token}, function(err, user) {
            if (err) return cb(err);
            cb(null, user);
        });
    });
}

// User 변수에 'User'라는 모델 안의 userSchema라는 스키마를 담는다.
const User = mongoose.model('User', userSchema);
// 외부파일에서 User 모델사용가능하게
module.exports = {
    User
}