const mongoose = require('mongoose');

//created the model for the object we plan to create and type of data
const productSchema = mongoose.Schema({
    _id   : mongoose.Schema.Types.ObjectId, // creating a unique id 
    name  : String,
    price : Number

});

module.exports = mongoose.model('Product', productSchema);