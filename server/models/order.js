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
        required: true
    }
});

module.exports = {Order};