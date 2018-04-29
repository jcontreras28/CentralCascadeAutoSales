
const request = require('superagent');
var {mongoose} = require('../db/mongoose');
var {Order} = require('../models/order');
const {SuplierOrder} = require('../models/suplierOrder');

class suplierACME {

    constructor() {
        this.api_key = "cascade.53bce4f1dfa0fe8e7ca126f91b35d3a6";
        this.model = ["anvil", "wife", "roadrunner"];
        this.pack = ["std", "super", "elite"];
    }

    placeOrder(order, callback) {
            
        request
            .post('http://localhost:3050/order')
            .send({ "api_key": this.api_key, "model": order.model, "package" : order.package })
            .set('accept', 'json')
            .end((err, res) => {

                console.log("res ", res.body.order);
                // Calling the end function will send the request
                if (res.body.order > 0) {
                    order.order_placed_to_suplier = true;
                    order.suplier_order_id = res.body.order;
                    order.save().then((doc)  => {
                        callback(undefined, res.body.order);
                    }, (e) => {
                        callback(e);
                    }); 
                }
            });
            
    }

    // check if we have the package available before we can place the order
    havePackage(order) {
        var canFill = (this.pack.includes(order.package) && this.model.includes(order.model));
        console.log('canFill through ACME', canFill);
        return canFill;
    }

}

module.exports = {suplierACME};