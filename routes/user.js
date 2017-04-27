const router = require('express').Router();
const User = require('mongoose').model('User');
const Role = require('mongoose').model('Role');
const Article = require('mongoose').model('Article');

const encrypt = require('./../utils/encrypt');



/* DETAILS */
const detailsGet = function(req, res) {
  if(!req.isAuthenticated())
    return res.redirect('/');

  return res.render('user/details');
};




/* EDIT */
const editGet = function(req, res) {
  if(!req.isAuthenticated())
    return res.redirect('/');

  return res.render('user/edit');
};

const editPost = function(req, res) {
  if(!req.isAuthenticated())
    return res.redirect('/');

  const pass = req.body.password;
  const rePass = req.body.repeatedPassword;
  const img = req.files.image;

  //pass update function
  const updatePass = function() {
    if(pass !== rePass)
      return res.render('user/edit', {info: 'Passwords don\'t match'});

    const salt = encrypt.generateSalt();
    const passwordHash = encrypt.hashPassword(pass, salt);

    User.update({_id: req.user.id}, {$set: 
      { passwordHash: passwordHash,
        salt: salt}},
      function(error) {
      if(error) {
        console.log(error);
        return res.render('index', {info: 'Database error'});
      }
    });
  };

  //img update function
  const updateImg = function() {
    img.mv(`./public/images/${img.name}`, function(error) {
      if(error) {
        console.log(error);
        return res.render('user/edit', {info: 'Cant move img'});
      }
    });

    User.update({_id: req.user.id}, {$set: {profileImage: `/images/${img.name}`}},
      function(error) {
      if(error) {
        console.log(error);
        return res.render('index', {info: 'Database error'});
      }
    });
  };

  //nothing changed
  if(!pass && !img)
    return res.render('user/edit', {info: 'Either change pass or change image'});

  //pass changed
  if(!img) { 
    updatePass();
    return res.render('user/edit', {info: 'Password updated'});
  }

  //img changed
  if(!pass) {
    updateImg();
    return res.render('user/edit', {info: 'Picture updated'});
  }

  //both changed
  updatePass(); 
  updateImg();
  return res.render('user/edit', {info: 'Pass and Pic updated!'});
};




/* DELETE USER */
const deleteUser = function(req, res) {
  if(!req.isAuthenticated())
    return res.redirect('/');

  //either the admin entered one or the logged in one
  const userName = req.body.delUser || req.user.username;

  return User.findOne({username: userName}, function(error, user) {
    if(error) {
      console.log(error);
      return res.render('index', {info: 'Database error'});
    }
    //if no such user exists
    if(!user)
      return res.render('user/details', {user: req.user, info: 'No such user'}); 

    //find and remove the user
    return User.findByIdAndRemove(user.id, function(error, user) {
      if(error) {
        console.log(error);
        return res.render('index', {info: 'Database error'});
      }
      //find User role
      return Role.findOne({name: 'User'}, function(error, role) {
        if(error) {
          console.log(error);
          return res.render('index', {info: 'Database error'});
        }

        //remove his articles
        return Article.remove({author: user.id}, function(error, articles) {
          if(error) {
            console.log(error);
            return res.render('index', {info: 'Database error'});
          }
          //remove from User role
          role.users.splice(user.id, 1);
          role.save(function(error) {
            if(error) {
              console.log(error);
              return res.render('index', {info: 'Database error'});
            }
            //success
            return res.render('index', {info: `${user.username} Deleted`});
          });
        });
      });
    });
  });
};




/* ROUTER */
router.get('/details', detailsGet);
router.get('/edit', editGet);
router.post('/edit', editPost);
router.get('/delete', deleteUser);
router.post('/delete', deleteUser);




module.exports = router;
