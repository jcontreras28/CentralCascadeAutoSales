
const request = require('superagent');
const {mongoose} = require('../db/mongoose');
const {Order} = require('../models/order');
const {SuplierOrder} = require('../models/suplierOrder');

class suplierRTS {

    constructor() {
        this.model = ["pugetsound", "olympic"];
        this.pack = ["mtn", "ltd", "14k"];
    }

    // return one time use token to requester so they can place an order with it
    getOrderToken(callback){
       
        request
            .post('http://localhost:3051/nonce_token')
            .send({ "name" : "ccas-bb9630c04f" })
            .set('accept', 'json')
            .end((err, res) => {
                    
                if (err) {
                    callback(err);

                } else {
                    callback(undefined, res.body.nonce_token);

                }
            }); 
    }

    placeOrder(order, token, callback) {
       
        request
            .post('http://localhost:3051/request_customized_model')
            .send({ "token": token, "model": order.model, "package" : order.package })
            .set('accept', 'json')
            .end((err, res) => {
                console.log("res ", res.body.order_id);
                if (res.body.order_id > 0) {

                    order.order_placed_to_suplier = true;
                    order.suplier_order_id = res.body.order_id;
                    order.save().then((doc)  => {
                        callback(undefined, res.body.order_id);
                    }, (e) => {
                        callback(e);
                    }); 
                }
            });
    }

    // check if we have the package available before we can place the order
    havePackage(order) {
        var canFill = (this.pack.includes(order.package) && this.model.includes(order.model));
        console.log('canFill through RTS', canFill);
        return canFill;
    }

}

module.exports = {suplierRTS};