
const request = require('superagent');
var {mongoose} = require('../db/mongoose');
var {Order} = require('../models/order');
const {SuplierOrder} = require('../models/suplierOrder');

class suplierACME {

    constructor() {
        this.api_key = "cascade.53bce4f1dfa0fe8e7ca126f91bs5d3a6";
        this.model = ["anvil", "wife", "roadrunner"];
        this.pack = ["std", "super", "elite"];
    }



    placeOrder(order) {
            
        request
            .post('http://localhost:3050/order')
            .send({ "api_key": this.api_key, "model": order.model, "package" : order.package })
            .set('accept', 'json')
            .end((err, res) => {
                console.log("just called end...");
                // Calling the end function will send the request
                if (err) {
                    console.log("err: ");
                } else {
                    console.log("res: ", res.body.order);
                    if (res.body.order > 0) {
                        order.order_placed_to_suplier = true;
                        order.suplier_order_id = res.body.order;
                        order.save().then((doc)  => {
                            console.log('Order has been placed to suplier.');
                        }, (e) => {
                            res.status(400).send(e);
                        }); 
                    }
                }
            });
            
    }

    havePackage(order) {
        var canFill = (this.pack.includes(order.package) && this.model.includes(order.model));
        console.log('canFill', canFill);
        return canFill;
    }

}

module.exports = {suplierACME};