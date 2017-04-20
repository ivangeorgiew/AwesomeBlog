const passport = require('passport');
const LocalPassport = require('passport-local');
const User = require('mongoose').model('User');

const authenticateUser = function(username, password, done) {
  User.findOne({email: username}).exec(function(err, user) {
    if(err) 
      return done(err);

    if(!user || !user.authenticate(password, user))
      return done(null, false);

    return done(null, user);
  });
};

const init = function() {
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
    User.findById(id).exec(function(err, user) {
      if(err)
        return done(err);
      if(!user)
        return done(null, false)

      return done(null, user)
    });
  });
};

module.exports = init();
