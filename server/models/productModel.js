const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    item:{
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdBy: {
        type: String,
        required: true,
    }, 
    createdByEmail: {
        type: String,
        required: true,
    },
    createdByNumber: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    createdByID: {
        type: String,
        required:true,
   },
});

const Product = mongoose.model('product', productSchema);

module.exports = Product;