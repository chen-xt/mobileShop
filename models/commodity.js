var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommoditySchema = new Schema({
    name: String,
    info: String,
    color: String,
    price: Number,
    quantity: Number,
    imgSrc: String
});

module.exports = mongoose.model('Commodity', CommoditySchema);