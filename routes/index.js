var express = require('express');
var router = express.Router();
var crypto = require('crypto');//加载生成MD5值依赖模块
var mongoose = require('mongoose'); 
// mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/DB'); //连接数据库

//图片上传
var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/goods')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({ 
    storage: storage ,
    //对上传文件进行大小限制、名称限制
    /*limits:{
        fileSize: 200k;
    }*/
});

var User = require('../models/user');  //用户
var Commodity = require('../models/commodity');  //商品
var Cart = require('../models/cart');  //购物车
var Address = require('../models/Address');  //收货地址
var Collect = require('../models/Collect');  //收藏的商品

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
                     var md5 = crypto.createHash('md5');
                     var pwd = md5.update(password).digest('base64');
                     User.create({username: username, password: pwd, status:0}, function(error, user) {
                        if (err) return next(err); 
                        req.session.user = user;
                        // console.log('注册成功');
                        req.flash('success', req.session.user.username + '注册成功');
                        res.redirect('/user-login');
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
    // var password = req.body.password;
    //密码用md5值表示
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');

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
                    //now=1说明是用户登录
                    res.redirect('/?userid=' + user._id +'&&now=1' );                               
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
    // var password = req.body.password;
    //密码用md5值表示
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
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
                req.flash('error', '请输入正确用户类型(管理员/用户)的用户名'); 
                res.redirect('/manager-login');
            }
            else{
                if(password != user.password){ 
                    req.flash('error', '密码错误');
                    res.redirect('/manager-login');
                 }else{
                    req.session.user = user;//保存用户信息
                    req.flash('success', '登陆成功！');
                    //now=2说明是管理员登录
                    res.redirect('/?userid=' + user._id+'&&now=2');                               
                }
            }      
        }); 
    }   
});

//用户管理(ok)
router.get('/user-manage', function(req, res) {
   var page = Number(req.query.page || 1);//当前页
   var limit = 3;//每页显示的条数

   User.count().then(function(count){
        //计算总页数
        pages = Math.ceil((count-1)/limit);//向上取整
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);

        var skip = (page - 1) * limit;//忽略跳过的条数

        User.find({status:0}).limit(limit).skip(skip).then(function( user) {
            res.render('user-manage', {
                title: '用户管理',
                user1: user,
                page: page,
                pages: pages,
                status: req.session.user.status
            });
             console.log(req.session.user.status);
        });
   });
});

//添加用户(ok)
/*router.get('/addUser', function(req, res) {
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
});*/

//删除用户(ok)
router.get('/delUser', function(req, res) {
    var id = req.query.id;
    User.remove({ _id: id}, function(err) {
        if(err) {
            console.log(error);
        } else {
            req.flash('success', '删除成功！');
            res.redirect('/user-manage');         
        }
    });  
});

// 修改用户信息(ok)
/*router.get('/updateUser', function(req, res) {
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
            req.flash('success', '修改成功！');
            res.redirect('/user-manage');
        }
    });
});*/

//商品管理(ok)
//limit(Nuumber):限制获取的数据条数
//skip(Nuumber):忽略数据的条数
router.get('/commodity-manage', function(req, res) {
  var page = Number(req.query.page || 1);//当前页
  var limit = 5;//每页显示的条数
  
  Commodity.count().then(function(count){
        // console.log(count);//打印总数
        //计算总页数
        pages = Math.ceil(count/limit);//向上取整
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);

        var skip = (page - 1) * limit;//忽略跳过的条数

        Commodity.find().limit(limit).skip(skip).then(function( commodity) {
            res.render('commodity-manage', {
                title: '商品管理',
                commodity: commodity,
                page: page,
                pages: pages
            });
        });
   });
});

// 添加商品(ok)
router.get('/addCommodity', function(req, res) {
    res.render('addCommodity', { title: '添加商品' });
});
router.post('/addCommodity',upload.array('imgSrc', 5), function(req, res) {
    var name = req.body.name;
    var info = req.body.info;
    var color = req.body.color;
    var price = req.body.price;
    var quantity = req.body.quantity;
    if( name == ''|| info  == ''|| color  == ''|| price  == ''|| quantity  == ''){
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
                    imgSrc: [
                        req.files[0].filename,
                        req.files[1].filename,
                        req.files[2].filename,
                        req.files[3].filename,
                        req.files[4].filename
                    ]
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
    var id = req.query.id;
    Commodity.findOne({ _id: id}, function(err, commodity) {
        res.render('updateCommodity', {
            title: '商品修改',
            commodity: commodity
        });
   });
});
router.post('/updateCommodity',upload.array('imgSrc', 5), function(req, res) {
    var id = req.query.id;
    var update = {$set : { 
        name : req.body.name,
        info : req.body.info,
        color : req.body.color,
        price : req.body.price,
        quantity : req.body.quantity,
        imgSrc: [
                   req.files[0].filename,
                   req.files[1].filename,
                   req.files[2].filename,
                   req.files[3].filename,
                   req.files[4].filename
                ]
    }};
    Commodity.update({_id: id}, update, function(err){
        if(err) {
            console.log(error);
        } else {
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
        res.redirect('/user-login');
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
    var page = Number(req.query.page || 1);//当前页
    var limit = 8;//每页显示的条数

    Commodity.count().then(function(count){
        console.log(count);//打印总数
        //计算总页数
        pages = Math.ceil(count/limit);//向上取整
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);

        var skip = (page - 1) * limit;//忽略跳过的条数

        Commodity.find().limit(limit).skip(skip).then(function( commodity) {
            res.render('all-commodity', {
                title: '所有商品',
                commodity: commodity,
                page: page,
                pages: pages
            });
            console.log(page);
        });
   });
});

// 会员中心(ok)
router.get('/vip',function(req, res){  
    User.findOne({username: req.session.user.username},function(err, user) {
        if(err) {
            console.log(error);
        } 
        else {
            Address.find({ uId: req.session.user._id },function(err, address) {
                if(err) {
                    console.log(error);
                } 
                else{
                    var page = Number(req.query.page || 1);//当前页
                    var limit = 8;//每页显示的条数
                    Collect.count().then(function(count){
                        console.log(count);//打印总数
                        //计算总页数
                        pages = Math.ceil(count/limit);//向上取整
                        //取值不能超过pages
                        page = Math.min(page, pages);
                        //取值不能小于1
                        page = Math.max(page, 1);

                        var skip = (page - 1) * limit;//忽略跳过的条数

                        Collect.find({ suId: req.session.user._id }).limit(limit).skip(skip).then(function( collect) {
                            res.render('vip', {
                                title: '会员中心',
                                user: user,
                                address: address,
                                collect: collect,
                                page: page,
                                pages: pages
                            });
                            console.log(page);
                            console.log(pages);
                        });
                    });
                }
            });
        }
   });
});

//会员中心--修改个人信息(ok)
router.post('/updateInformation', function(req, res) {
    var id = req.query.id;
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
            res.redirect('/vip#infomation');
            console.log('保存成功！');
        }
    });
});

//会员中心--密码重置(ok)
router.post('/updatePassword', function(req, res) {
    var id = req.query.id;
    var pwd = req.session.user.password;
    if(req.body.pwd1 != pwd){
        req.flash('error', '原始密码不匹配');
        console.log('原始密码不匹配');
        res.redirect('/vip#password');
    }
    else{
        if(req.body.pwd2 != req.body.pwd3){
            req.flash('error', '两次输入的密码不一致');
            console.log('两次输入的密码不一致');
            res.redirect('/vip#password');
        }
        else{
            var update = {$set : {  password: req.body.pwd2 }};
            User.update({_id: id}, update, function(err){
                if(err) {
                    console.log(error);
                } else {    
                    req.flash('success', '密码修改成功！');
                    res.redirect('/vip#information');
                    console.log('密码修改成功！');
                }
            });
        }
    }  
    console.log(req.session.user.password);
    console.log(req.body.pwd1);
});

//会员中心--收货地址修改( ok)
router.get('/updateAddress', function(req, res) {
    var id = req.query.id;
    Address.findOne({ _id: id },function(err, address) {
        res.render('updateAddress', {
            title: '修改收货地址',
            address: address
        });
    });
});
router.post('/updateAddress', function(req, res) {
    var id = req.query.id;
    var addrName = req.body.addrName;
    var addr = req.body.addr;
    var code = req.body.code;
    var tel = req.body.tel;
    if( addrName == ''|| addr  == ''|| code  == ''|| tel  == ''){
        req.flash('error', '输入框不能为空');
        console.log('输入框不能为空');
        res.redirect('/vip#address');
    }
    else{
        var update = {$set : { 
            addrName: addrName,
            addr : addr,
            code : code,
            tel : tel
        }};
        Address.update({_id: id}, update, function(err){
            if(err) {
                console.log(error);
            } else {    
                req.flash('success', '成功修改收货地址！');
                res.redirect('/vip#address');
                console.log('成功修改收货地址！');
            }
        });
    }
});

//会员中心--收货地址增加(ok)
router.get('/addAddress', function(req, res) {
      res.render('addAddress', { title: '增加收货地址' });
});
router.post('/addAddress', function(req, res) {
    var uId = req.session.user._id;console.log(req.session.user._id);
    var addrName = req.body.addrName;console.log(req.body.addrName);
    var addr = req.body.addr;
    var code = req.body.code;
    var tel = req.body.tel;
    if( addrName == ''|| addr  == ''|| code  == ''|| tel  == ''){
        req.flash('error', '输入框不能为空');
        res.redirect('/addAddress#address');
    }
    else{
       Address.create({
            uId: uId,
            addrName: addrName, 
            addr: addr,
            code: code,
            tel: tel
        }, function(err, address) {
            if(err) {
                console.log(err);
            } else{
                req.flash('success', '成功添加收货地址！');
            res.redirect('/vip#address');
            }   
       });
    }    
});

//会员中心--收货地址删除(ok)
router.get('/delAddress', function(req, res) {
    var id = req.query.id;
    Address.remove({ _id: id}, function(err) {
        if(err) {
            console.log(error);
        } else {
            // console.log('删除成功');
            req.flash('success', '删除成功！');
            res.redirect('/vip#address');         
        }
    });  
});

//商品详情页（ok）
router.get('/good', function(req, res) {
    Commodity.findOne({name: req.query.name}, function(err, commodity){
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

// 设置为管理员(还有问题)
router.get('/updateStatus', function(req, res) {
    var id = req.query.id;
    User.update({_id: id}, {$set : {  status: 1 }}, function(err){
        if(err) {
            console.log(error);
        } else {
            console.log('设置管理员成功');
            res.redirect('/user-manage');
        }
    });  
});

// 加入收藏(ok)
router.get('/addToCollect/:id', function (req, res) {
    if (!req.session.user) {
        req.flash('error', '用户已过期，请重新登录');
        res.redirect('/user-login');
    } 
    else {
        Collect.findOne({"suId": req.session.user._id, "sId": req.params.id}, function (err, collect) {
            if(err){
                console.log("error :" + err);
            }
            else if(collect){
                // 商品已经存在
                req.flash('success', '商品已经存在');
                res.redirect('/vip#collect');
            }
            else {
                Commodity.findOne({"_id": req.params.id}, function (err, collect) {
                    if(err){
                        console.log("error :" + err);
                    }
                    else{
                        Collect.create({
                                suId: req.session.user._id,
                                sId: req.params.id,
                                sName: collect.name,
                                sInfo: collect.info,
                                sPrice: collect.price,
                                sColor: collect.color,
                                sQuantity: collect.quantity,
                                sImgSrc: collect.imgSrc
                            }, function(err, collect) {
                                if (err) return next(err); 
                                console.log('添加收藏成功');
                                // req.flash('success', '成功加入收藏！');
                                res.redirect('/vip#collect');
                        });
                    }       
                });
            }
        });
    }
});


module.exports = router;