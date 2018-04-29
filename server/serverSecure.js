var express = require('express');
var bodyParser = require('body-parser');
var schedule = require('node-schedule');
var _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Order} = require('./models/order');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');
var {suplierACME} = require('./myModules/suplierACME');
var {listAllJson, takeAndProcess, downloadOrderJson, checkForNewOrdersAndSendToSuplier} = require('./controllers/orderController');

var app = express();

app.use(bodyParser.json()); // for passing req and res values


// ***********  Routes **********************

// list orders
app.get('/orders', authenticate, listAllJson);

// place order
app.post('/order', takeAndProcess);    

// path to download order 
app.get('/download/:id', downloadOrderJson);

// create user
app.post('/users', (req, res) => {

    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });

});

// login user
app.post('/users/login', (req, res) => {

    var body = _.pick(req.body, ['email', 'password']);
    
    User.findByCredentials(body.email, body.password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });

});

// remove user token - logout
app.delete('/users/me/token', authenticate, (req, res) => {

    req.user.removeToken(req.token).then(() => {
        res.status(200).send
    }, () => {
        res.status(400).send();
    });
    
});


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