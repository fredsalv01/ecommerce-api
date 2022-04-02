const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    products: [
        {
            productId: {
                type: String,
            },
            quantity: {
                type: Number,
                default: 1
            },
            price: {
                type: Number,
            },
            name: {
                type: String,
            },
            image: {
                type: String,
            },
            total: {
                type: Number,
            }
            
        }
    ],
    amount: {
        type: Number,
        required: true
    },
    address: {
        type: Object,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'pending'
    }
}, 
    {
        versionKey: false,
        timestamps: true
    }
);

module.exports = mongoose.model('Order', orderSchema);