var express = require('express');
var bodyParser = require('body-parser');
var schedule = require('node-schedule');
var _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Order} = require('./models/order');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');
var {suplierACME} = require('./myModules/suplierACME');
var {listAllJson, takeAndProcess, downloadOrderJson} = require('./controllers/orderController');

var app = express();

app.use(bodyParser.json()); // for passing req and res values



app.get('/orders', authenticate, listAllJson);

app.post('/order', takeAndProcess);    

// path to download order 
app.get('/download/:id', downloadOrderJson);

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })
});

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
  
      var acmesuplier = new suplierACME();
      var rtssuplier = new suplierRTS();
  
      Order.find({'order_placed_to_suplier': false}).then((orders) => {
  
          console.log('Orders to place: ', orders.length);
          orders.forEach((order)=> {
              if (acmesuplier.havePackage(order)) {
                 
                  console.log('placing oder to acme');
                  acmesuplier.placeOrder(order);
  
              } else if (rtssuplier.havePackage(order)){
  
                  console.log('placeing order to rts');
                  rtssuplier.getOrderToken((error, tokenResults) => {
                      if (error) {
                          console.log("error from getOrderToken: ", error);
                      } else {
                          console.log("token: ",tokenResults);
                          rtssuplier.placeOrder(order, tokenResults, (error, results) => {
                              if (error) {
                                  console.log("error from placeOrderrder: ", error);
                              } else {
                                  console.log("Order palced through rts.  Order Id is: ", results);
                              }
                          });
                      }
                  });
  
              } else {
                  console.log('We have no supliers that carry that make/model');
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