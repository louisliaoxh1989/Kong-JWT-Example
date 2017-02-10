var colors = require('colors');
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

db.once('open', function callback() {

    var user = new UserModel();
    user.username = 'jwtuser';
    user.password = 'jwtuser';

    user.save(function (err) {
        if (err) {
            console.log(err);
            console.log('Could not save user.'.red);
            process.exit();
        } else {
            console.log('Database seeded'.green);
            console.log(user._id);
            process.exit();

        }


    })

});



