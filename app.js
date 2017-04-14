/* CONSTANTS */
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const routes = require('./routes');
const fileUpload = require('express-fileupload');
const app = express();




/* DATABASE */
mongoose.Promise = global.Promise; 
mongoose.connect('mongodb://localhost:27017/blog');

require('./models/Role');
require('./models/User');
require('./models/Article');

mongoose.connection.once('open', function(error) {
  if(error)
    console.log(error);
  else
    console.log('MongoDB ready!');
});





/* BASIC CONFIGURATION */

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Parser for the request's data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Uploading images
app.use(fileUpload());

// Using cookies
app.use(cookieParser());

// Session is storage for cookies, which will be de/encrypted with that 'secret' key.
app.use(session({secret: 's3cr3t5tr1ng', resave: false, saveUninitialized: false}));

// For user validation we will use passport module.
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  if(req.user)
    res.locals.user = req.user;
  next();
});

// This makes the content in the "public" folder accessible for every user.
app.use(express.static(path.join(__dirname, 'public')));




// Exporting for bin/www
module.exports = app;
