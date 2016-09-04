//分析express原理
var url = require('url');
function express(){
    var app = function (req,res) {
    //    当请求到来的时候，我们要取出method和path
        var method = req.method.toLowerCase();
        var urlObj = url.parse(req.url,true);
        var pathname = urlObj.pathname;//请求的路径
        req.path = pathname;//获取路径
        req.query = urlObj.query;//获取查询参数
        req.hostname = req.headers['host'].split(':')[0];//获取主机名
        var index = 0; //先调用routes中第一个对象
        next();
        function next(err) {
            if (index >= app.routes.length) {
                return res.end(`Cannot${method}${pathname}`);
            }
            var route = app.routes[index++];
            if(err){
                //如果有错误，执行错误中间件，method middleware 4个参数
                if(route.method=='middleware' && route.fn.length==4){
                    //route.fn.length==4 参数的个数就是函数的个数
                    return route.fn(err,req,res,next)
                }else{
                    //不是错误中间件，将错误继续传递下去
                    next(err)
                }
            }else{
                if(route.method == 'middleware'){
                    //中间件
                    if(route.path=='/'||route.path==pathname||pathname.startsWith(route.path+'/')){
                        route.fn(req,res,next);
                    }else{
                        next();
                    }
                }else{
                    //路由 如果当前的路由有查询参数
                    if(route.params){
                        //看是否能匹配上
                        //用路径正则去匹配，我们的pathname
                        var matchers = pathname.match(new RegExp(route.path));
                        if(matchers){
                            var obj = {};
                            route.params.forEach(function (item, index) {
                                obj[item] = matchers[index+1];
                            });
                            req.params = obj;
                            route.fn(req,res);
                        }else{
                            next();
                        }
                    }else{
                        if((route.method==method||route.method=='all')&&(route.path==pathname||route.path=='*')){
                            route.fn(req,res);
                        }else{
                            next()
                        }
                    }

                }
            }

        }


       /* var route = app.routes.find(function (item) {
            //如果只为true，返回当前这一项item
            return (item.method == method || item.method == 'all') && (item.path == pathname || item.path == '*');
        });
        if (route) {
            route.fn(req, res)
        } else {
            res.end(`Cannot ${method} ${pathname}`)
        }*/
    };



    //当express函数执行后返回app函数
    //创建一个listen方法，用来监听端口号
    app.listen= function (port) {
      require('http').createServer(app).listen(port)
    };

    //声明get方法，对应的当前请求路径和回调函数
    app.routes=[];//routes是存放所有路径的
    //构造所有方法的数组
    var methods = ['get','post','delete','put','options','all'];
    methods.forEach(function (method) {
        app[method] = function (path, fn) {
            //    每次调用get方法时，将path,fn,method 都存起来
            //    当访问时候匹配path和method 如果匹配到执行fn
            var config={method:method,path:path,fn:fn};
            app.routes.push(config);

        };
    });
    app.use = function (path,fn) {
        if(typeof fn != 'function'){
            fn = path; //没有传递让fn等于函数给path设置默认为/
            path = '/';
        }
        var config = {method:'middleware',path:path,fn:fn};
        app.routes.push(config);
    };
    return app;
}
//导出一个函数，名字叫express
module.exports = express;