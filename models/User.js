const mongoose = require('mongoose');

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

// User 변수에 'User'라는 모델 안의 'userSchema'라는 스키마를 담는다.
const User = mongoose.model('User', userSchema);
// 외부파일에서 User 모델사용가능하게
module.exports = { User }