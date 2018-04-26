var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Order} = require('./models/order');

var app = express();

app.use(bodyParser.json());

app.post('/order', (req, res) => {

    var order = new Order({
        make: req.body.make,
        model: req.body.model,
        package: req.body.package,
        customer_id: req.body.customer_id
    });
    
    order.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });    
});


app.listen(3000, () => {
    console.log('Started on port 3000');
});
