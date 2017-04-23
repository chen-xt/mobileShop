var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); 
mongoose.connect('mongodb://localhost/DB'); //连接数据库

var User = require('../models/user');  //用户
var Commodity = require('../models/commodity');  //商品
var Cart = require('../models/cart');  //购物车

/* GET home page. */

//首页(ok)
router.get('/', function(req, res) {
	  res.render('index', { title: '主页' });
});

//注册(ok)
router.get('/reg', function(req, res) {
    res.render('reg', { title: '用户注册' });
});
router.post('/reg', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var password1 = req.body.password1;
    if( username == ''|| password  == ''|| password1  == ''){
        // console.log('输入框不能为空');
        req.flash('error', "输入框不能为空！");
        res.redirect('/reg');
    }else if(password != password1){
        // console.log('密码不一致');
        req.flash("error", '两次输入密码不一致！');
        res.redirect('/reg');
    }
    else{
        User.findOne({username: username},function(err, user){
                if(err){
                    console.log("error :" + err);
                }
                else if(user){
                    // console.log("用户名已存在");
                    req.flash("error", '用户名已存在');
                    res.redirect('/reg');
                }
                else{
                     User.create({username: username, password: password, status:0}, function(error, user) {
                        if (err) return next(err); 
                        req.session.user = user;
                        // console.log('注册成功');
                        req.flash('success', req.session.user.username + '注册成功');
                        res.redirect('/login');
                });
                }       
        });
    }    
});

// 用户登录(ok)
router.get('/user-login', function(req, res) {
    res.render('user-login', { title: '用户登录' });
});
router.post('/user-login', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    if( username == ''|| password  == ''){
        req.flash('error', '用户名或密码不能为空');
        res.redirect('/user-login');
    }
    else{
        User.findOne({username: username},function(err, user){
            if(!user){
                req.flash('error', '用户名不存在');
                res.redirect('/user-login');
            }
            else if(user.status == 1){
                // 判断是用户还是管理员
                req.flash('error', '请输入正确用户类型(管理员/普通用户)的用户名'); 
                res.redirect('/user-login');
            }
            else{
                if(password != user.password){ 
                    req.flash('error', '密码错误');
                    res.redirect('/user-login');
                 }else{
                    req.session.user = user;//保存用户信息
                    req.flash('success', '登陆成功！');
                    res.redirect('/?userid=' + user._id);                               
                }
            }       
        }); 
    }    
});

// 管理员登录(ok)
router.get('/manager-login', function(req, res) {
    res.render('manager-login', { title: '管理员登录' });
});
router.post('/manager-login', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    if( username == ''|| password  == ''){
        req.flash('error', '用户名或密码不能为空');
        res.redirect('/user-login');
    }
    else{
        User.findOne({username: username},function(err, user){
            if(!user){
                req.flash('error', '用户名不存在');
                res.redirect('/manager-login');
            }
            else if(user.status == 0){
                // 判断是用户还是管理员
                req.flash('error', '请输入正确用户类型(管理员/普通用户)的用户名'); 
                res.redirect('/manager-login');
            }
            else{
                if(password != user.password){ 
                    req.flash('error', '密码错误');
                    res.redirect('/manager-login');
                 }else{
                    req.session.user = user;//保存用户信息
                    req.flash('success', '登陆成功！');
                    res.redirect('/?userid=' + user._id);                               
                }
            }      
        }); 
    }   

});

//用户管理(ok)
router.get('/user-manage', function(req, res) {
   User.find(function(err, user) {
        res.render('user-manage', {
            title: '用户管理',
            user: user
        });
   });
});

//添加用户(ok)
router.get('/addUser', function(req, res) {
    res.render('addUser', { title: '添加用户' });
});
router.post('/addUser', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var sex = req.body.sex;
    var QQ = req.body.QQ;
    var email = req.body.email;
    var address = req.body.address;
    var tel = req.body.tel;
    if( username == ''|| password  == ''|| sex  == ''|| QQ  == ''|| email  == ''|| address  == ''|| tel  == ''){
        // console.log('输入框不能为空');
        req.flash('error', '输入框不能为空');
        res.redirect('/addUser');
    }
    else{
        User.findOne({username: username},function(err, user){
            if(err){
                console.log("error :" + err);
            }
            else if(user){
                // console.log(user);
                // console.log("用户已经存在，请重新添加新用户");
                req.flash('error', '用户已经存在，请重新添加新用户');
                res.redirect('/addUser');
            }
            else{
                 User.create({
                    username: username, 
                    password: password,
                    sex: sex,
                    QQ: QQ, 
                    email: email, 
                    address: address,
                    tel: tel
                }, function(err, commodity) {
                    if (err) return next(err); 
                    // console.log('添加成功');
                    req.flash('success', '添加用户成功！');
                    res.redirect('/user-manage');
            });
           }       
        });
    }    
});

//删除用户(ok)
router.get('/delUser', function(req, res) {
    var id = req.query.id;
    User.remove({ _id: id}, function(err) {
        if(err) {
            console.log(error);
        } else {
            // console.log('删除成功');
            req.flash('success', '删除成功！');
            res.redirect('/user-manage');         
        }
    });  
});

// 修改用户信息(ok)
router.get('/updateUser', function(req, res) {
    var id = req.query.id;
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
        sex: req.body.sex,
        QQ : req.body.QQ,
        email : req.body.email,
        address : req.body.address,
        tel : req.body.tel
    }};
    User.update({_id: id}, update, function(err){
        if(err) {
            console.log(error);
        } else {
            // console.log('修改成功!');
            req.flash('success', '修改成功！');
            res.redirect('/user-manage');
        }
    });
});

//商品管理(ok)
router.get('/commodity-manage', function(req, res) {
   Commodity.find(function(err, commodity) {
        res.render('commodity-manage', {
            title: '商品管理',
            commodity: commodity
        });
   });
});

// 添加商品(ok)
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
        // console.log('输入框不能为空');
        req.flash('error', '输入框不能为空');
        res.redirect('/addCommodity');
    }
    else{
        Commodity.findOne({name: name},function(err, commodity){
            if(err){
                console.log("error :" + err);
            }
            else if(commodity){
                // console.log("商品已经存在");
                console.log(commodity);
                req.flash('error', '商品已经存在');
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
                    // console.log('添加成功');
                    req.flash('success', '添加成功！');
                    res.redirect('/commodity-manage');
            });
           }       
        });
    }    
});

// 修改商品(ok)
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
            // console.log('修改成功!');
            req.flash('success', '修改成功！');
            res.redirect('/commodity-manage');
        }
    });
});

// 删除商品(ok)
router.get('/delCommodity', function(req, res) {
    var id = req.query.id;
    Commodity.remove({ _id: id}, function(err) {
        if(err) {
            console.log(error);
        } else {
            // console.log('删除成功');
            req.flash('success', '删除成功！');
            res.redirect('/commodity-manage');         
        }
    });  
});

// 退出(ok)
router.get('/logout', function (req, res) {
    req.session.user = null;//清空session
    req.flash('sucess', '退出成功！');
    res.redirect('/');
});

//查看购物车商品(ok)
router.get('/cart', function(req, res) {
     // res.render('cart', { title: '购物车' });
     if (!req.session.user) {
            // req.session.error = "用户已过期，请重新登录:"
            req.flash('error', '用户已过期，请重新登录');
            res.redirect('/login');
        } else {
            Cart.find({ "uId": req.session.user._id }, 
                function (err, cart) {
                    res.render('cart', {
                        title: '购物车',
                        cart: cart
                    });
                });
        }
});

// 删除购物车商品(ok)
router.get('/delCart/:id', function (req, res) {
    Cart.remove({"_id": req.params.id}, function (err) {
        if(err) {
            console.log(error);
        } else {
            req.flash('success', '删除成功！');
            res.redirect('/cart');
        }
        console.log(req.params.id);
    });
});

//添加购物车商品(ok)
router.get('/addToCart/:id', function (req, res) {
    if (!req.session.user) {
        req.flash('error', '用户已过期，请重新登录');
        res.redirect('/login');
    } 
    else {
        Cart.findOne({"uId": req.session.user._id, "cId": req.params.id}, function (err, cart) {
            if(err){
                console.log("error :" + err);
            }
            else if(cart){
                // 商品已经存在
                Cart.update({
                    "uId": req.session.user._id,
                    "cId": req.params.id
                }, {$set: {cQuantity: cart.cQuantity + 1}}, function (err) {
                    if(err){
                        console.log("error :" + err);
                    }else{
                        req.flash('success', '商品数量加1');
                        res.redirect('/cart');
                    }        
                });
            }
            else {
                Commodity.findOne({"_id": req.params.id}, function (err, cart) {
                        if(err){
                            console.log("error :" + err);
                        }
                        else{
                            Cart.create({
                                uId: req.session.user._id,
                                cId: req.params.id,
                                cName: cart.name,
                                cPrice: cart.price,
                                cColor: cart.color,
                                cImgSrc: cart.imgSrc,
                                cQuantity: 1
                            }, function(err, cart) {
                                if (err) return next(err); 
                                // console.log('添加成功');
                                req.flash('success', '成功加入购物车！');
                                res.redirect('/cart');
                            });
                        }       
                });
            }
        });
    }
});

// 所有商品展示(ok)
router.get('/all-commodity', function(req, res) {
    Commodity.find(function(err, commodity) {
        res.render('all-commodity', {
            title: '所有商品',
            commodity: commodity
        });
        // console.log(commodity);
    });
});


// 会员中心
router.get('/vip',function(req, res){  
    User.find({username: req.session.user.username},function(err, user) {
        res.render('vip', {
            title: '会员中心',
            user: user
        });
        console.log(req.session.user);
   });
});


//会员中心--修改个人资料(有错误)
router.post('/updateInformation', function(req, res) {
    var id = req.query.id;console.log(req.query.id);
    var update = {$set : { 
        sex: req.body.sex,
        QQ : req.body.QQ,
        email : req.body.email,
        address : req.body.address,
        tel : req.body.tel
    }};
    User.update({_id: id}, update, function(err){
        if(err) {
            console.log(error);
        } else {    
            req.flash('success', '保存成功！');
            res.redirect('/vip');
        }
    });
});


//商品详情页（有错误：无法查询单条数据）
router.get('/good', function(req, res) {
    Commodity.findOne({name: '魅族MX6'}, function(err, commodity){
        // console.log(req.params.id);
        if(err){
            console.log("error :" + err);
         }
        else{
            res.render('good', {
            title: '商品详情',
            commodity: commodity
         });
        }               
    }); 
});


module.exports = router;