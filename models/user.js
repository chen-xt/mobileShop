// 用户表
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: String, //用户名
    password: String, //用户密码
    sex: String, //用户性别
    QQ : Number, //用户QQ
    email :String, //用户邮箱
    address :String, //用户居住地址
    tel: Number, //用户联系电话
    time: Date,
    //两个用来区分管理员和用户，00为用户, 01普通管理员，11为超级管理员
    status: { type: Number, default: 0  } ,
    // status1: { type: Number, default: 0  }
});

module.exports = mongoose.model('User', UserSchema);// 与Users表关联