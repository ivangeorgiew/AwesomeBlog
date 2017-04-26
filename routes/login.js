const router = require('express').Router();
const User = require('mongoose').model('User');




/* LOGIN */
const loginGet = function(req, res) {
  return res.render('login');
};

const loginPost = function(req, res) {
  return User.findOne({email: req.body.email}, function(error, user) {
    if(error) {
      console.log(error);
      return res.render('login', {info: 'Database error'});
    }
    if(!user || !user.authenticate(req.body.password, user))
      return res.render('login', {info: 'Username or password is invalid!'});

    return req.logIn(user, function(error) {
      if(error) {
        console.log(error);
        return res.render('login', {info: 'Passport error'});
      }
      //successful login
      return res.redirect('/');
    });
  });
};




/* ROUTER */
router.get('/', loginGet);
router.post('/', loginPost);




module.exports = router;
