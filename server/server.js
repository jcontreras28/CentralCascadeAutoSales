var express = require('express');
var bodyParser = require('body-parser');
var schedule = require('node-schedule');

var {mongoose} = require('./db/mongoose');
var {Order} = require('./models/order');
var {suplierACME} = require('./myModules/suplierACME');
var {listAllJson, takeAndProcess, downloadOrderJson} = require('./controllers/orderController');

var app = express();

app.use(bodyParser.json()); // for passing req and res values



app.get('/orders', listAllJson);

app.post('/order', takeAndProcess);    

// path to download order 
app.get('/download/:id', downloadOrderJson);

// sending orders to supliers via seperate task - that way if it fails due to server issue
// it will have the chance to get placed again next time the task is ran.
var j = schedule.scheduleJob('* * * * *', function(){

  console.log('The answer to life, the universe, and everything!');

    var acmesuplier = new suplierACME();

    Order.find().then((orders) => {
        console.log('here', orders);
        orders.forEach((order)=> {
            if (acmesuplier.havePackage(order)) {
               
                console.log('placing oder to acme');
                acmesuplier.placeOrder(order);

            } else {

                console.log('acme cant fill order');

            }
        });
        
    }, (e) => {
        return e;
    });

});


app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {app};