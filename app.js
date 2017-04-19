/* MODULES */
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const fileUpload = require('express-fileupload');
const app = express();




/* DEV OR TEST */
const env = 'development';
const config = {
  development: 'mongodb://localhost:27017/blog',
  test: 'mongodb://localhost:27017/test'
};




/* DATABASE */
mongoose.Promise = global.Promise;
// Connect to the db
mongoose.connect(config[env], function(err){
  if(err)
    console.log('Error connection to db: ' + error);
  else
    console.log('MongoDB ready at: ' + config[env]);
});

// Initializes the models
require('./models/Role');
require('./models/User');
require('./models/Article');






/* EXPRESS CONFIGURATIONS */
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

// Make the current user visible for the controllers
app.use(function(req, res, next) {
  if(req.user)
    res.locals.user = req.user;
  next();
});

// This makes the content in the "public" folder accessible for every user.
app.use(express.static(path.join(__dirname, 'public')));




/* PASSPORT */
require('./utils/passport');




/* ROUTES */
const homeRouter = require('./routes/home');
//const loginRouter = require('./routes/login');
//const registerRouter = require('./routes/register');
//const articleRouter = require('./routes/article');
//const userRouter = require('./routes/user');

app.use('/', homeRouter);
//app.use('/login/', loginRouter);
//app.use('/register/', registerRouter);
//app.use('/user/', userRouter);
//app.use('/article/', articleRouter);




// Exporting for bin/www
module.exports = app;
