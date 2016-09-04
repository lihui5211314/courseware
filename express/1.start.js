//使用express第三方模块，导入express
var express = require('./express');//函数
var app = express();//app也是一个函数

// app就是我们的监听函数
//require('http').createServer(app).listen(3000);
// app.get方法，当访问/的时候，执行回调函数
app.get('/',function(req,res){
    res.end('hello World')
});
app.get('/student',function(req,res){
    res.end('hello student')
});

app.get('*',function(req,res){
    res.end('hello ***')
});
//上面只要没匹配到就会置信个all + *
app.all('*',function(req,res){
    res.end('all没有匹配到的')
});
//发送不同类型的请求 curl -X POST http://localhost:3000
app.listen(3000);//监听3000端口