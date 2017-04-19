const router = require('express').Router();
const User = require('mongoose').model('User');

const login = {
  loginGet: function(req, res) {
    res.render('login');
  },

  loginPost: function(req, res) {
    User.findOne({email: req.body.email}).then(function(user) {
      if(!user || !user.authenticate(req.body.password)) {
        console.log(user.authenticate(req.body.password));
        req.body.error = 'Either username or password is invalid!';
        res.render('login', req.body);
      } 
      else {
        req.logIn(user, function(err) {
          if(err) {
            console.log(err);
            res.redirect('login', {error: err.message});
            return;
          } 
          else {
            let returnUrl = '/';
            if(req.session.returnUrl){
              returnUrl = req.session.returnUrl;
              delete req.session.returnUrl;
            }
            res.redirect(returnUrl);
          }
        });
      }
    });
  }
};

module.exports = login;
