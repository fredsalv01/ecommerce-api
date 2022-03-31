const mongoose = require('mongoose');


const cartSchema = new mongoose.Schema({
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
            }
        }
    ]
},
    {
        versionKey: false,
        timestamps: true
    }
);

module.exports = mongoose.model('Cart', cartSchema);
