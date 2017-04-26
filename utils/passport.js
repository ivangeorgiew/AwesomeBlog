const passport = require('passport');
const LocalPassport = require('passport-local');
const User = require('mongoose').model('User');




/* AUTHNTICATE */
const authenticateUser = function(username, password, done) {
  User.findOne({email: username}, function(error, user) {
    if(error) 
      return done(error);

    if(!user || !user.authenticate(password, user))
      return done(null, false);

    return done(null, user);
  });
};




/* INITIALIZATION */
const init = function() {
  //passport setup as shown in the website
  passport.use(new LocalPassport({
    usernameField: 'email',
    passwordField: 'password'
  }, authenticateUser));

  passport.serializeUser(function(user, done) {
    if(!user)
      return done(null, false);

    return done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(error, user) {
      if(error)
        return done(error);
      if(!user)
        return done(null, false)

      return done(null, user)
    });
  });
};




module.exports = init();
