var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: String,
    password: String,
    QQ : Number,
    email :String,
    address :String,
    tel: Number
});

module.exports = mongoose.model('User', UserSchema);// 与Users表关联