const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const {mongoose} = require('./db/mongoose');

const theSalt = 'thisismyamazingsaltprobshoudlusebcryptinstead';

var app = express();

var g_TokenArray = []; // prob need time stamp to make token only valid certain amount of time.

app.use(bodyParser.json());

app.post('/nonce_token', (req, res) => {
    var name = req.body.name;
    if (name == 'ccas-bb9630c04f') {
        var data = {
            id: 100
        }
        var token = jwt.sign(data, theSalt);
        g_TokenArray.push(token);
        res.send({"nonce_token" : token});
    } else {
        res.status(401).send({"results" : "Incorrect name provided for request."});
    }
});

app.post('/request_customized_model', (req, res) => {
    
    var index = g_TokenArray.indexOf(req.body.token);

    if (index >= 0) {
        g_TokenArray.splice(index, 1);
        var id = Date.now();
        res.send({"order_id" : id});
    } else {
        res.status(401).send({"results" : "Incorrect token provided for request."});
    }
   
});

app.post('/', (req, res) => {
    console.log('at root');
});


app.listen(3051, () => {
    console.log('Started serverRTS on port 3051');
});

module.exports = {app};