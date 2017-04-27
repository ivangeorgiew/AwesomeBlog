const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const fileUpload = require('express-fileupload');
const http = require('http');
const app = express();




/* DEV OR TEST */
const env = process.env.NODE_ENV || 'development';
const db = {
  development: 'mongodb://localhost/blog',
  test: 'mongodb://localhost/test'
};




/* DATABASE */
//set promise
mongoose.Promise = require('bluebird');

// Initializes the models
require('./models/Article');
require('./models/Role');
require('./models/User');

//start mongo
mongoose.connect(db[env], function(error){
  if(error)
    console.log('Error connection to db: ' + error);
  else
    console.log('MongoDB ready at: ' + db[env]);
});





/* EXPRESS CONFIGURATIONS */
// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

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

// Make the current user visible for the views
// after login for example
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
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const articleRouter = require('./routes/article');
const userRouter = require('./routes/user');

app.use('/', homeRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/article', articleRouter);
app.use('/user', userRouter);




/* SERVER */
const server = http.createServer(app);
const port = 3000;

//error handling
server.on('error', function(error) {
  if(error.syscall !== 'listen')
    throw error;

  switch(error.code) {
    case 'EACCES':
      console.error(`Port ${port} requires more privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`Port ${port} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
