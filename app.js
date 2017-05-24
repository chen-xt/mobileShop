var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");

var routes = require('./routes/index');
var users = require('./routes/users');

//session会话
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);//mongodb使用
//引入 flash 模块来实现页面通知
var flash = require('connect-flash');

//创建项目实例
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());//定义使用 flash 功能

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//提供session支持
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret:'secret',
    cookie:{
        maxAge: 1000*60*30
    },
    store: new MongoStore({   //创建新的mongodb数据库
       db: 'session',      //数据库的名称
       url: 'mongodb://localhost:27017'
       
    })
}));

/*// 中间件传递信息
app.use(function(req, res, next){
    res.locals.user = req.session.user;
    var err = req.session.error;
    res.locals.message = '';
    if (err) res.locals.message = '<div class="alert alert-danger" style="margin-bottom: 20px;color:red;">' + err + '</div>';
    next();
});
*/
app.use(function(req, res, next){
    //res.locals.xxx实现xxx变量全局化，在其他页面直接访问变量名即可
    //访问session数据：用户信息
    res.locals.user = req.session.user;
    //显示错误信息
    var error = req.flash('error');//获取flash中存储的error信息
    res.locals.error = error.length ? error : null;
    //显示成功信息
    var success = req.flash('success');
    res.locals.success = success.length ? success : null;
    next();
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
