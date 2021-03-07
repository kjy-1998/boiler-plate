// 익스프레스를 사용하겠다
const express = require('express');
// 익스프레스 함수를 사용하겠다
const app = express();
const port = 5000;

// 몽구스를 사용하겠다
const mongoose = require('mongoose');
// 이 저장소를 사용하겠다
mongoose.connect('mongodb+srv://jaeyunkim:<kuabara1!>@boilerplate.q9ytn.mongodb.net/test', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...')).catch(err => console.log(err));

app.get('/', (req, res) => res.send('오늘도 모험을 떠나요.'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));