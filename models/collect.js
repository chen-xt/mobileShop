// 收藏的商品表
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CollectSchema = new Schema({
    suId: String , //用户ID
    sId: String , //商品ID
    sName: String, //商品名称
    sInfo: String, //商品描述
    sColor: String, //商品颜色
    sPrice: Number, //商品价格
    sQuantity: Number, //商品数量
    sImgSrc: [ String ] //定义为数组
});

module.exports = mongoose.model('Collect', CollectSchema);		

