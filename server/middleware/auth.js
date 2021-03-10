// 미들웨어 auth
const {
    User
} = require('../models/User');
// 인증처리를 하는 곳 
let auth = (req, res, next) => {
    // 1. 클라이언트 쿠키에서 토큰을 가져옴
    let token = req.cookies.x_auth;
    // 2. 토큰을 복호화 한 후 유저를 찾는다. (token과 secretToken 활용)
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({
            isAuth: false,
            error: true
        });
        req.token = token;
        req.user = user;
        // auth 미들웨어가 끝나면 미들웨어를 빠져나갈 수 있도록
        next();
    })
    // 3. 유저가 있으면 인증 OK
    // 4. 유저가 없으면 인증 NO !
}

module.exports = {
    auth
}