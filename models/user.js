var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: String,
    password: String,
    sex: String,
    QQ : Number,
    email :String,
    address :String,
    tel: Number,
    status: { type: Number, default: 0  } //区分管理员和用户，0为用户，1为管理员
});

module.exports = mongoose.model('User', UserSchema);// 与Users表关联