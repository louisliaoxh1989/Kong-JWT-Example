/**
 * Created by lxh on 17-2-10.
 */
var colors = require('colors')
var mongoose = require('mongoose');

var got = require('got');
/**
 * Import the model(s)
 */
var UserModel = require('./models/user');

/**
 * Connect to the database
 */
mongoose.connect('mongodb://172.16.52.89/jwttest');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Failed to connect to database!'.red));
var userName = "jwtuser";
db.once('open', function callback() {
    UserModel.findOne({ "username" : userName}, function(err, user){
        var bodyData = {"username": user.username, "custom_id": '' + user._id + ''};
        got("http://localhost:8001/consumers", {body:bodyData,json: true}).then(response => {
            console.log('Kong Create User Success'.green);
            console.log(colors.green(JSON.stringify(response.body)));
            var jwtCreateUrl = "http://localhost:8001/consumers/" + user.username + "/jwt";
            var jwtCreateBody = {"secret": '' + user._id + '', "key": '' + user._id + ''};
            got(jwtCreateUrl,{body:jwtCreateBody,json: true}).then(response => {
                console.log('Kong Create User JWT credential Success'.green);
                console.log(colors.green(JSON.stringify(response.body)));
                process.exit();
            }).catch(error => {
                console.log('Kong Create User JWT credential Err'.red);
                console.log(colors.red(JSON.stringify(error.response.body)));
                process.exit();
            });
        }).catch(error => {
            console.log('Kong Create User JWT credential Err'.red);
            console.log(colors.red(JSON.stringify(error.response.body)));
            process.exit();
        });

    });
});