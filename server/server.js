var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var {mongoose} = require('./db/mongoose');
var {Order} = require('./models/order');

var app = express();

app.use(bodyParser.json());

app.get('/orders', (req, res) => {
    Order.find().then((orders) => {
        res.send({orders});
    }, (e) => {
        res.status(400).send(e);
    })
});

app.post('/order', (req, res) => {

    var order = new Order({
        make: req.body.make,
        model: req.body.model,
        package: req.body.package,
        customer_id: req.body.customer_id
    });
    
    // save order to db AND write a .json file to public/orders folder
    order.save().then((doc) => {
        fs.writeFile(__dirname + '/../public/orders/'+doc.customer_id+'.json', JSON.stringify(doc), (err) => {
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
});


// path to download order 
app.get('/download/:id', function(req, res){
    var file = __dirname + '/../public/orders/'+req.params.id+'.json';
    res.download(file); // Set disposition and send it.
});


app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {app};