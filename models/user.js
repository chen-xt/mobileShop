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
    status: { type: Number, default: 0  } //区分管理员和用户，0为用户，1为管理员
});

module.exports = mongoose.model('User', UserSchema);// 与Users表关联