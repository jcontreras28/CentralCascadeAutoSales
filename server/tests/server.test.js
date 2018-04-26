const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Order} = require('./../models/order');

beforeEach((done) => {
    Order.remove({}).then(() => done());
});

describe('POST /order', () => {
    it('should create a new order', (done) => {
        var make = 'A test model';
        var model = 'A test model';
        var package = 'a test package';
        var customer_id = '1';

        request(app)
            .post('/order')
            .send({make,model,package,customer_id})
            .expect(200)
            .expect((res) => {
                expect(res.body.make).toBe(make);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Order.find().then((order) => {
                    expect(order.length).toBe(1);
                    expect(order[0].make).toBe(make);
                    done();
                }).catch((e) => done(e));
            });
    });
});