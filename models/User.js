const mongoose = require('mongoose');
// 비밀번호 암호화 라이브러리 사용
const bcrypt = require('bcrypt');
// 암호화에 필요한 salt를 10글자로 만들겠다.
const saltRounds = 10;

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
    var user = this;
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
// User 변수에 'User'라는 모델 안의 userSchema라는 스키마를 담는다.
const User = mongoose.model('User', userSchema);
// 외부파일에서 User 모델사용가능하게
module.exports = {
    User
}