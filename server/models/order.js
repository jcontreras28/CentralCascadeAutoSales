var mongoose = require('mongoose');

var Order = mongoose.model('Order', {
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    package: {
        type: String,
        required: true
    },
    customer_id: {
        type: Number,
        required: true,
        unique: true
    },
    order_placed_to_suplier: {
        type: Boolean,
        required: true,
        default: false
    },
    suplier_order_id: {
        type: Number,
    }
});

module.exports = {Order};