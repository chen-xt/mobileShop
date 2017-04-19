var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CartSchema = new Schema({
    uId: String , //用户名字
    cId: String , //购物车里商品ID
    cName: String ,
    cPrice: String ,
    cColor: String ,
    cImgSrc: String ,
    cQuantity: Number
    // cStatus : { type: Boolean, default: false  }
});

module.exports = mongoose.model('Cart', CartSchema);		

