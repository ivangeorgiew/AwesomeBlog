const router = require('express').Router();
const User = require('mongoose').model('User');

const loginGet = function(req, res) {
  res.render('login');
};

const loginPost = function(req, res) {
  User.findOne({email: req.body.email}).exec(function(error, user) {
    if(error)
      console.log(error);

    else if(!user || !user.authenticate(req.body.password, user))
      res.render('login', {error: 'Username or password is invalid!'});

    else {
      req.logIn(user, function(error) {
        if(error) 
          res.render('login', {error: error.message});

        //for edit article redirection
        else if(req.session.returnUrl) {
          res.redirect(req.session.returnUrl);
          delete req.session.returnUrl;
        }

        else 
          res.redirect('/');
      });
    }
  });
};

router.get('/', loginGet);
router.post('/', loginPost);

module.exports = router;
