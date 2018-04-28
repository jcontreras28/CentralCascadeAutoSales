var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var {mongoose} = require('./db/mongoose');


var app = express();

app.use(bodyParser.json());


app.post('/order', (req, res) => {
    
    // Use timestamp as id just to fake it here...  TODO - ad db to actually place suplier orders
    var id = Date.now();
    res.send({"order" : id});
   
});

app.post('/', (req, res) => {
    console.log('at root');
});


app.listen(3050, () => {
    console.log('Started on port 3050');
});

module.exports = {app};