var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommoditySchema = new Schema({
    name: String,
    info: String,
    color: String,
    price: Number,
    quantity: Number,
    imgSrc: [ String ] //定义为数组
});

module.exports = mongoose.model('Commodity', CommoditySchema);