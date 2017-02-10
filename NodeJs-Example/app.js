/**
 * Load up the project dependencies
 */
var express = require('express')
var colors = require('colors')
var mongoose = require('mongoose');
var url = require('url')
var jwt = require('jwt-simple');

/**
 * Import the model(s)
 */
var UserModel = require('./models/user')

/**
 * THe JWT middleware
 */
var jwtauth = require('./lib/jwtauth')

/**
 * Connect to the database
 */
mongoose.connect('mongodb://localhost/jwttest');

/**
 * Create the express app
 * NOTE: purposely not using var so that app is accesible in modules.
 */
app = express()

/**
 * Set the secret for encoding/decoding JWT tokens
 */
app.set('jwtTokenSecret', 'd7ae4de8c83944fcad8098635fc340ef')

/**
 * A simple middleware to restrict access to authenticated users.
 */
var requireAuth = function(req, res, next) {
	if (!req.user) {
		res.end('Not authorized', 401)
	}	else {
		next()
	}
}

/**
 * Load up the controllers
 */
var controllers = require('./controllers')
controllers.set(app)

/**
 * Start listening
 */
var server = app.listen(3000, function() {
	console.log('Listening on port %d'.green, server.address().port)
});
app.get('/userinfo', express.bodyParser(), function(req, res){
var username = req.headers["x-consumer-username"];	
res.send(username);      
})
/**
 * An example protected route.
 */
app.get('/secert', express.bodyParser(),jwtauth, requireAuth, function(req, res){
        console.log(req.headers["x-consumer-custom-id"]);	
	res.send('Hello ' +req.user.username);
})
