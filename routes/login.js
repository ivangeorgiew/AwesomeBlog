const router = require('express').Router();
const User = require('mongoose').model('User');

const loginGet = function(req, res) {
  res.render('login');
};

const loginPost = function(req, res) {
  User.findOne({email: req.body.email})
  .then(function(user) {
    if(!user || !user.authenticate(req.body.password))
      res.render('login', {error: 'Username or password is invalid!'});

    else {
      req.logIn(user, function(error) {
        if(error) 
          res.redirect('login', {error: error.message});

        else if(req.session.returnUrl) {
          res.redirect(req.session.returnUrl);
          delete req.session.returnUrl;
        }

        else 
          res.redirect('/');
      });
    }
  })
  .catch(function(error) {
    res.render('error', {error});
  });
};

router.get('/', loginGet);
router.post('/', loginPost);

module.exports = router;
