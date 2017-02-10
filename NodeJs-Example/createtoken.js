/**
 * Created by lxh on 17-2-10.
 */
var jwt = require('jwt-simple');
var moment = require('moment');
var mongoose = require('mongoose');
var UserModel = require('./models/user');

mongoose.connect('mongodb://172.16.52.89/jwttest');
var db = mongoose.connection;
var userName = "jwtuser";

db.once('open', function callback() {
    UserModel.findOne({"username": userName}, function (err, user) {
        var expires = moment().add('seconds', 120).valueOf()
        var token = jwt.encode(
            {
                iss: ''+user._id,
                exp: expires
            },
            ''+user._id
        );
        console.log(token);
        process.exit();
    });
});