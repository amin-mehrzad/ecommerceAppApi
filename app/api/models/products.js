const mongoose = require('mongoose');
//Define a schema
const Schema = mongoose.Schema;
const ProductSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    sku: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    categories: {
        type: [String],
        required: true
    }
});
module.exports = mongoose.model('Product', ProductSchema)