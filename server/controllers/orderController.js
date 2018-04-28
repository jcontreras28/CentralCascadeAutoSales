const {mongoose} = require('../db/mongoose');
const {Order} = require('../models/order');
var fs = require('fs');

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
            console.log("The file was saved!");
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