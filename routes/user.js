const router = require('express').Router();
const User = require('mongoose').model('User');
const encrypt = require('./../utils/encrypt');

const detailsGet = function(req, res) {
  if(!req.isAuthenticated())
    return res.redirect('/');
  res.render('user/details');
};

const editGet = function(req, res) {
  if(!req.isAuthenticated())
    return res.redirect('/');
  res.render('user/edit');
};

const editPost = function(req, res) {
  if(!req.isAuthenticated())
    return res.redirect('/');

  const pass = req.body.password;
  const rePass = req.body.repeatedPassword;
  const img = req.files.image;

  const updatePass = function() {
    if(pass !== rePass)
      return res.render('user/edit', {error: 'Passwords don\'t match'});

    const salt = encrypt.generateSalt();
    const passwordHash = encrypt.hashPassword(pass, salt);

    User.update({_id: req.user.id}, {$set: 
      { passwordHash: passwordHash,
        salt: salt}},
      function(error) {
      if(error) {
        console.log(error);
        return res.render('index', {error: 'Database error'});
      }
    });
  };

  const updateImg = function() {
    img.mv(`./public/images/${img.name}`, function(error) {
      if(error) {
        console.log(error);
        return res.render('user/edit', {error: 'Cant move img'});
      }
    });

    User.update({_id: req.user.id}, {$set: {profileImage: `/images/${img.name}`}},
      function(error) {
      if(error) {
        console.log(error);
        return res.render('index', {error: 'Database error'});
      }
    });
  };

  if(!pass && !img)
    return res.render('user/edit', {error: 'Either change pass or change image'});

  if(!img) { 
    updatePass();
    return res.render('user/edit', {error: 'Password updated'});
  }

  if(!pass) {
    updateImg();
    return res.render('user/edit', {error: 'Picture updated'});
  }

  updatePass(); 
  updateImg();
  return res.render('user/edit', {error: 'Pass and Pic updated!'});
};

router.get('/details', detailsGet);
router.get('/edit', editGet);
router.post('/edit', editPost);

module.exports = router;
