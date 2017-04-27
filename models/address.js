var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AddressSchema = new Schema({
    uId: String , //用户ID
    addrName: String , //收货人名字
    addr: String ,
    code: Number ,
    tel: Number
});

module.exports = mongoose.model('Address', AddressSchema);		

