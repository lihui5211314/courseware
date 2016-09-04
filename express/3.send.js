var express = require('express');
var app = express();
app.listen(3001);
/*
1.解决乱码问题
2.解决设置对象格式
3.自动转换状态码
*/
app.use(function (req,res,next) {
    res.send = function (msg) {

    }
});
app.get('/', function (req, res) {
    res.sendStatus(404)
});