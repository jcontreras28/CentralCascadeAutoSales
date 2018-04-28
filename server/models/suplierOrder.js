var mongoose = require('mongoose');

var SuplierOrder = mongoose.model('SuplierOrder', {
    order_id: {
        type: Number,
        required: true,
        unique: true
    },
    suplier_order_id: {
        type: Number,
        required: true
    }
});

module.exports = {SuplierOrder};