var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AddressSchema = new Schema({
    uId: String , //用户ID
    addrName: String , //收货人名字
    addr: String , //收货地址
    code: Number , //邮政编码
    tel: Number //联系电话
});

module.exports = mongoose.model('Address', AddressSchema);		

