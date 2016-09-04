
var express = require('express');//函数
var app = express();//app也是一个函数
//中间件
//1.中间件就是起过渡作用，检查权限，检查是否合法，最后再进入我们的真正的路由
//2.中间件有next方法，如果一旦不满足，可以决定是否继续执行，如果调用next方法，表示继续执行
//3.中间件也可以匹配路径，只要路径揩油匹配即可,默认是/,等同于不写
/*
* /user/add
* /user
* */
//4.中间件中的req和res 和路由中的是同一个
//5.一个页面中可以有多个中间件
//用途：扩展req和res上的属性
//当匹配成功后执行函数
app.use(function (req, res,next) {
    console.log('过滤石头');
});

app.get('/user',function(req,res){
    res.end('hello World')

});

app.listen(3200);