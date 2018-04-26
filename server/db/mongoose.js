var mongoose = require('mongoose');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

mockgoose.prepareStorage().then(function() {
    // mongoose connection		
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://someplace/ccas');
});