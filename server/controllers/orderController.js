const {mongoose} = require('../db/mongoose');
const fs = require('fs');

const {Order} = require('../models/order');
const {suplierACME} = require('../myModules/suplierACME');
const {suplierRTS} = require('../myModules/suplierRTS');
const {customers} = require('../models/customers');

module.exports.downloadOrderJson = function(req, res, next) {
    var file = __dirname + '/../../public/orders/'+req.params.id+'.json';
    res.download(file); // Set disposition and send it.
}

module.exports.listAllJson = function(req, res, next) {
    Order.find().then((orders) => {
        res.send({orders});
    }, (e) => {
        res.status(400).send(e);
    });
}

module.exports.takeAndProcess = function(req, res, next) {

    if (!(req.body.customer_id in customers)) {
        res.status(400).send({"results":"Customer does not exist (real app would have signup form) use id of 1-6"});
    } else if (customers[req.body.customer_id].country_code != 1) {
        res.status(400).send({"results": "We only ship to the USA - country code 1"});
    } else {

        var order = new Order({
            make: req.body.make,
            model: req.body.model,
            package: req.body.package,
            customer_id: req.body.customer_id
        });

        
        
        // save order to db AND write a .json file to public/orders folder
        order.save().then((doc) => {
            fs.writeFile(__dirname + '/../../public/orders/'+doc.customer_id+'.json', JSON.stringify(doc), (err) => {
                if (err) {
                    return console.log("error saving file", err);
                }
                //console.log("The file was saved!");
            });
            var downloadUrl = "localhost:3000/download/"+doc.customer_id;
            reply = {
                "results" : "success",
                "downloadLink" : downloadUrl
            }
            res.send(reply);
        }, (e) => {
            res.status(400).send(e);
        });   
    }
}

module.exports.checkForNewOrdersAndSendToSuplier = function(req, res) {

    var acmesuplier = new suplierACME();
    var rtssuplier = new suplierRTS();

    Order.find({'order_placed_to_suplier': false}).then((orders) => {

        console.log('Orders to place: ', orders.length);
        orders.forEach((order)=> {
            if (acmesuplier.havePackage(order)) {
               
                console.log('placing oder to acme');
                acmesuplier.placeOrder(order);

            } else if (rtssuplier.havePackage(order)){

                console.log('placeing order to rts');
                rtssuplier.getOrderToken((error, tokenResults) => {
                    if (error) {
                        console.log("error from getOrderToken: ", error);
                    } else {
                        console.log("token: ",tokenResults);
                        rtssuplier.placeOrder(order, tokenResults, (error, results) => {
                            if (error) {
                                console.log("error from placeOrderrder: ", error);
                            } else {
                                console.log("Order palced through rts.  Order Id is: ", results);
                            }
                        });
                    }
                });

            } else {
                console.log('We have no supliers that carry that make/model');
            }
        });
        
    }, (e) => {
        return e;
    });
}