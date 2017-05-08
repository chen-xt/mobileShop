var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CartSchema = new Schema({
    uId: String , //用户ID
    cId: String , //购物车里商品ID
    cName: String , //商品名称
    cPrice: String , //商品价格
    cColor: String , //商品颜色
    cImgSrc: [ String ] , //商品图片路径
    cQuantity: Number //商品数量
});

module.exports = mongoose.model('Cart', CartSchema);		

