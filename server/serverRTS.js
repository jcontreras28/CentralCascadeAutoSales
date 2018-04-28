var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
const jwt = require('jsonwebtoken');

var {mongoose} = require('./db/mongoose');

const theSalt = 'thisismyamazingsaltprobshoudlusebcryptinstead';

var app = express();


app.use(bodyParser.json());

app.post('/monce_token', (req, res) => {
    var data = {
        id: 100
    }
    var token = jwt.sign(data, theSalt);
    res.send({"monce_token" : token});
});

app.post('/request_customized_model', (req, res) => {
    
    var decoded = jwt.verify(token, 'thisismyamazingsaltprobshoudlusebcryptinstead');
    if (decoded) {
        var id = Date.now();
        res.send({"order" : id});
    }
   
});

app.post('/', (req, res) => {
    console.log('at root');
});


app.listen(3050, () => {
    console.log('Started on port 3050');
});

module.exports = {app};