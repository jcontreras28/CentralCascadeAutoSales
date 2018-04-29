const express = require('express');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');

const {mongoose} = require('./db/mongoose');

const {Order} = require('./models/order');
const {listAllJson, takeAndProcess, downloadOrderJson, checkForNewOrdersAndSendToSuplier} = require('./controllers/orderController');

var app = express();

app.use(bodyParser.json()); // for passing req and res values


// ***********  Routes **********************

// List all orders as Json
app.get('/orders', listAllJson);

// Place order
app.post('/order', takeAndProcess);    

// path to download order 
app.get('/download/:id', downloadOrderJson);


// sending orders to supliers via seperate task - that way if it fails due to server issue
// it will have the chance to get placed again next time the task is ran.
var j = schedule.scheduleJob('* * * * *', function(){

    console.log('I am aliiiiiiiiiiiiiive!  I am aliiiiiiiiiiiiiive!');

    checkForNewOrdersAndSendToSuplier();

});


app.listen(3000, () => {

    console.log('Started on port 3000');

});

module.exports = {app};