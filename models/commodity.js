// 商品表
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommoditySchema = new Schema({
    name: String, //商品名称
    info: String, //商品描述
    color: String, //商品颜色
    price: Number, //商品价格
    quantity: Number, //商品数量
    imgSrc: [ String ] //定义为数组
});

module.exports = mongoose.model('Commodity', CommoditySchema);