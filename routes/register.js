const router = require('express').Router();
const encrypt = require('./../utils/encrypt');
const User = require('mongoose').model('User');
const Role = require('mongoose').model('Role');

const registerGet = function(req, res) {
  res.render('register');
};

const registerPost = function(req, res) {
  User.findOne({email: req.body.email}).exec(function(error, user) {
    if(error)
      console.log(error);
    else if(user)
      res.render('register', {error: 'Email is already used'});
    else if(!req.body.password === req.body.repeatedPassword)
      res.render('register', {error: 'Passwords don\'t match'});
    else {
      const salt = encrypt.generateSalt(); 
      const passwordHash = encrypt.hashPassword(req.body.password, salt);

      if(req.files.image) {
        req.files.image.mv(`/public/images/${req.files.image.name}`, function(error) {
          if(error)
            console.log(error);
        });
      }

      const img = req.files.image || {name: 'default.jpg'};

      Role.findOne({name: 'User'}).exec(function(error, role) {
        if(error)
          return console.log(error);

        const userObject = {
          email: req.body.email,
          passwordHash: passwordHash,
          fullName: req.body.fullName,
          salt: salt,
          roles: [role.id],
          profileImage: `/images/${img.name}`
        };

        User.create(userObject, function(error, user) {
          if(error)
            return console.log(error);

          role.users.push(user.id);
          role.save(function(error) {
            if(error)
              res.render('register', {error: error.message});
            else 
              res.render('register', {error: 'Successfuly registered'});
          });
        });
      });
    }
  });
};

router.get('/', registerGet);
router.post('/', registerPost);

module.exports = router;
