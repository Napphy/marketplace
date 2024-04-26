const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    item:{
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        unique: true,
    },
    createdBy: {
        type: String,
        required: true,
    },
    image: {
        type: Text,
        required: true,
    }
});

const Product = mongoose.model('product', productSchema);

module.exports = Product;