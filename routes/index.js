var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); 
mongoose.connect('mongodb://localhost/DB'); //连接数据库

var User = require('../models/user');
var Commodity = require('../models/commodity');

/* GET home page. */

//首页
router.get('/', function(req, res) {
	  res.render('index', { title: '主页' });
});

//注册
router.get('/reg', function(req, res) {
    res.render('reg', { title: '用户注册' });
});
router.post('/reg', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var password1 = req.body.password1;
    if( username == ''|| password  == ''|| password1  == ''){
        console.log('用户名或密码不能为空');
        res.redirect('/reg');
    }else if(password != password1){
        console.log('密码不一致');
        res.redirect('/reg');
    }
    else{
        User.findOne({username: username},function(err, user){
                if(err){
                    console.log("error :" + err);
                }
                else if(user){
                    console.log("用户名已存在");
                    res.redirect('/reg');
                }
                else{
                     User.create({username: username, password: password}, function(error, user) {
                        if (err) return next(err); 
                        console.log('注册成功');
                        res.redirect('/login');
                });
                }       
        });
    }    
});

// 登录
router.get('/login', function(req, res) {
    res.render('login', { title: '用户登录' });
});
router.post('/login', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    if( username == ''|| password  == ''){
        console.log('用户名或密码不能为空');
        res.redirect('/login');
    }
    else{
       User.findOne({username: username},function(err, user){
        if(err){
            console.log("error :" + err);
        }
        else if(!user){
            console.log("用户名不存在");
            res.redirect('/login');
        }
        else{
            if(password != user.password){
                    console.log("密码错误"); 
                    res.redirect('/login');
               }else{
                    console.log(username); 
                    res.redirect('/?userid=' + user._id);
               }
        }       
    }); 
  }    
});

//商品详情页（有错误：无法查询单条数据）
router.get('/good', function(req, res) {
    Commodity.findOne({name: '魅蓝note5'}, function(err, commodity){
        if(err){
            console.log("error :" + err);
         }
        else{
            res.render('good', {
            title: '商品详情',
            commodity: commodity
         });
         /*console.log(req.query.name);
           console.log(commodity);*/
        }               
    }); 
});

//用户管理
router.get('/user-manage', function(req, res) {
   User.find(function(err, user) {
        res.render('user-manage', {
            title: '用户管理',
            user: user
        });
   });
});

//添加用户
router.get('/addUser', function(req, res) {
    res.render('addUser', { title: '添加用户' });
});
router.post('/addUser', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var QQ = req.body.QQ;
    var email = req.body.email;
    var address = req.body.address;
    var tel = req.body.tel;
    if( username == ''|| password  == ''|| QQ  == ''|| email  == ''|| address  == ''|| tel  == ''){
        console.log('输入框不能为空');
        res.redirect('/addUser');
    }
    else{
        User.find({username: username},function(err, user){
            if(err){
                console.log("error :" + err);
            }
            /*else if(user){
                console.log("用户已经存在");
                res.redirect('/addUser');
            }*/
            else{
                 User.create({
                    username: username, 
                    password: password,
                    QQ: QQ, 
                    email: email, 
                    address: address,
                    tel: tel
                }, function(err, commodity) {
                    if (err) return next(err); 
                    console.log('添加成功');
                    res.redirect('/user-manage');
            });
           }       
        });
    }    
});

//删除用户
router.get('/delUser', function(req, res) {
    var id = req.query.id;
    User.remove({ _id: id}, function(err) {
        if(err) {
            console.log(error);
        } else {
            console.log('删除成功');
            res.redirect('/user-manage');         
        }
    });  
});

// 修改用户信息
router.get('/updateUser', function(req, res) {
    var id = req.query.id;console.log(id);
    User.findOne({ _id: id}, function(err, user) {
        res.render('updateUser', {
            title: '用户信息修改',
            user: user
        });
   });
});
router.post('/updateUser', function(req, res) {
    var id = req.query.id;
    var update = {$set : { 
        username : req.body.username,
        password : req.body.password,
        QQ : req.body.QQ,
        email : req.body.email,
        address : req.body.address,
        tel : req.body.tel
    }};
    User.update({_id: id}, update, function(err){
        if(err) {
            console.log(error);
        } else {
            console.log('修改成功!');
            res.redirect('/user-manage');
        }
    });
});


router.get('/cart', function(req, res) {
    res.render('cart', { title: '购物车' });
});
router.get('/comment', function(req, res) {
    res.render('comment', { title: '留言板' });
});
router.get('/vip', function(req, res) {
    res.render('vip', { title: '会员中心' });
});


/* 管理员 */
//商品管理
router.get('/commodity-manage', function(req, res) {
   Commodity.find(function(err, commodity) {
        res.render('commodity-manage', {
            title: '商品管理',
            commodity: commodity
        });
   });
});

// 添加商品
router.get('/addCommodity', function(req, res) {
    res.render('addCommodity', { title: '添加商品' });
});
router.post('/addCommodity', function(req, res) {
    var name = req.body.name;
    var info = req.body.info;
    var color = req.body.color;
    var price = req.body.price;
    var quantity = req.body.quantity;
    var imgSrc = req.body.imgSrc;
    if( name == ''|| info  == ''|| color  == ''|| price  == ''|| quantity  == ''|| imgSrc  == ''){
        console.log('输入框不能为空');
        res.redirect('/addCommodity');
    }
    else{
        Commodity.find({name: name},function(err, commodity){
            if(err){
                console.log("error :" + err);
            }
            else if(commodity){
                console.log("商品已经存在");
                res.redirect('/addCommodity');
            }
            else{
                 Commodity.create({
                    name: name, 
                    info: info,
                    color: color, 
                    price: price, 
                    quantity: quantity,
                    imgSrc: imgSrc
                }, function(err, commodity) {
                    if (err) return next(err); 
                    console.log('添加成功');
                    res.redirect('/commodity-manage');
            });
           }       
        });
    }    
});

// 修改商品
router.get('/updateCommodity', function(req, res) {
    var id = req.query.id;console.log(id);
    Commodity.findOne({ _id: id}, function(err, commodity) {
        res.render('updateCommodity', {
            title: '商品修改',
            commodity: commodity
        });
   });
});
router.post('/updateCommodity', function(req, res) {
    var id = req.query.id;
    var update = {$set : { 
        name : req.body.name,
        info : req.body.info,
        color : req.body.color,
        price : req.body.price,
        quantity : req.body.quantity,
        imgSrc : req.body.imgSrc
    }};
    Commodity.update({_id: id}, update, function(err){
        if(err) {
            console.log(error);
        } else {
            console.log('修改成功!');
            res.redirect('/commodity-manage');
        }
    });
});

// 删除商品
router.get('/delCommodity', function(req, res) {
    var id = req.query.id;
    Commodity.remove({ _id: id}, function(err) {
        if(err) {
            console.log(error);
        } else {
            console.log('删除成功');
            res.redirect('/commodity-manage');         
        }
    });  
});


module.exports = router;