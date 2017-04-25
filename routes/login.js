const router = require('express').Router();
const User = require('mongoose').model('User');

const loginGet = function(req, res) {
  return res.render('login');
};

const loginPost = function(req, res) {
  User.findOne({email: req.body.email}, function(error, user) {
    if(error) {
      console.log(error);
      return res.render('login', {error: 'Database error'});
    }

    if(!user || !user.authenticate(req.body.password, user))
      return res.render('login', {error: 'Username or password is invalid!'});

    req.logIn(user, function(error) {
      if(error) 
        return res.render('login', {error: 'Passport error'});
      return res.redirect('/');
    });
  });
};

router.get('/', loginGet);
router.post('/', loginPost);

module.exports = router;
