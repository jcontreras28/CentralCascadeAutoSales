// We need this to build our post string
var querystring = require('querystring');
var http = require('http');
const request = require('superagent');

var {mongoose} = require('./db/mongoose');
var {Order} = require('./models/order');



RCMMakeArray = ["some makes"];


function PlaceOrderAcme(order) {

    suplierOrderObject = {
        "make": order.make,
        "model": order.model,
    }

    request
        .post('/api/pet')
        .send({ name: 'Manny', species: 'cat' }) // sends a JSON post body
        .set('X-API-Key', 'foobar')
        .set('accept', 'json')
        .end((err, res) => {
            // Calling the end function will send the request
        });
        
}




