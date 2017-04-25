const router = require('express').Router();
const encrypt = require('./../utils/encrypt');
const User = require('mongoose').model('User');
const Role = require('mongoose').model('Role');

const registerGet = function(req, res) {
  return res.render('register');
};

const registerPost = function(req, res) {
  User.findOne({email: req.body.email}, function(error, user) {
    if(error) {
      console.log(error);
      return res.render('register', {error: 'Database error'});
    }
    if(user)
      return res.render('register', {error: 'Email is already used'});
    if(!(req.body.password === req.body.repeatedPassword))
      return res.render('register', {error: 'Passwords don\'t match'});

    const salt = encrypt.generateSalt(); 
    const passwordHash = encrypt.hashPassword(req.body.password, salt);

    if(req.files.image) {
      req.files.image.mv(`./public/images/${req.files.image.name}`, function(error) {
        if(error){
          console.log(error);
          return res.render('register', {error: 'Cant move img'});
        }
      });
    }

    const img = req.files.image || {name: 'default.jpg'};

    Role.findOne({name: 'User'}, function(error, role) {
      if(error)
        return console.log(error);

      const userObject = {
        email: req.body.email,
        passwordHash: passwordHash,
        fullName: req.body.fullName,
        articles: [],
        roles: [role.id],
        salt: salt,
        profileImage: `/images/${img.name}`
      };

      User.create(userObject, function(error, user) {
        if(error) {
          console.log(error);
          return res.render('register', {error: 'Database error'});
        }

        role.users.push(user.id);
        role.save(function(error) {
          if(error) {
            console.log(error);
            return res.render('register', {error: 'Database error'});
          }
          return res.render('register', {error: 'Successfuly registered'});
        });
      });
    });
  });
};

router.get('/', registerGet);
router.post('/', registerPost);

module.exports = router;
