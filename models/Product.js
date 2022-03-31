const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    categories: {
        type: Array,
        required: true
    },
    color: {
        type: String
    },
    size: {
        type: String
    },
    stock: {
        type: Number,
        required: true
    }
}, 
    {
        versionKey: false,
        timestamps: true
    }
);

module.exports = mongoose.model('Product', productSchema);