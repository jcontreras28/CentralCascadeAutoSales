const expect = require('expect');
const request = require('supertest');

var {mongoose} = require('../db/mongoose');

const {app} = require('./../server');
const {Order} = require('./../models/order');


const orders = [{
        make: 'make',
        model: 'anvil',
        package: 'std',
        customer_id: 2
    }, {
        make: 'make',
        model: 'pugetsound',
        package: '14k',
        customer_id: 3
    }
];

beforeEach((done) => {
    Order.remove({}).then(() => {
        return Order.insertMany(orders);
    }).then(() => done());
});

describe('Regular Server Tests', function() {

    describe('POST /order', function() {
        //this.timeout(10000);
        it('should create a new order', (done) => {
            var make = 'make';
            var model = 'anvil';
            var package = 'std';
            var customer_id = '1';

            request(app)
                .post('/order')
                .send({make,model,package,customer_id})
                .expect(200)
                .expect((res) => {
                    expect(res.body).toExist();
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    Order.find().then((order) => {
                        expect(order.length).toBe(3);
                        expect(order[0].make).toBe(make);
                        done();
                    }).catch((e) => done(e));
                });
        });

        it('should not create a new order - customer not found!', (done) => {
            var make = 'make';
            var model = 'anvil';
            var package = 'std';
            var customer_id = '10';

            request(app)
                .post('/order')
                .send({make,model,package,customer_id})
                .expect(400)
                .end(done);
        });

        it('should not create a new order - customer not in USA!', (done) => {
            var make = 'make';
            var model = 'anvil';
            var package = 'std';
            var customer_id = '6';

            request(app)
                .post('/order')
                .send({make,model,package,customer_id})
                .expect(400)
                .end(done);
        });

        
    });

    describe('GET /orders', function() {

        it('should return all orders', (done) => {
            request(app)
                .get('/orders')
                .expect(200)
                .expect((res) => {
                    //expect(res.body.length).toBe(1);
                    expect(res.body.orders.length).toBe(2);
                })
                .end((err, res) => {
                    //app.close();
                    
                    done();
                });
        });

    });
});

