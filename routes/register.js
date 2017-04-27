const router = require('express').Router();
const encrypt = require('./../utils/encrypt');
const User = require('mongoose').model('User');
const Role = require('mongoose').model('Role');




/* REGISTER */
const registerGet = function(req, res) {
  return res.render('register');
};

const registerPost = function(req, res) {
  //valid username
  if(!/^[a-z0-9]*$/.test(req.body.username))
    return res.render('register', {info: 'Username must contain only a-z and 0-9'});
  //valid email
  if(!/^[a-zA-Z0-9.@_-]*$/.test(req.body.email))
    return res.render('register', {info: 'Email is invalid'});

  return User.findOne({email: req.body.email}, function(error, user) {
    if(error) {
      console.log(error);
      return res.render('register', {info: 'Database error'});
    }
    //if email is taken
    if(user)
      return res.render('register', {info: 'Email is already used'});

    return User.findOne({username: req.body.username}, function(error, user) {
      if(error) {
        console.log(error);
        return res.render('register', {info: 'Database error'});
      }
      //if username is taken
      if(user)
        return res.render('register', {info: 'Username is already used'});

      //if passwords don't match
      if(!(req.body.password === req.body.repeatedPassword))
        return res.render('register', {info: 'Passwords don\'t match'});
      
      //if image is uploaded

        if(req.files.image) {

            let index=req.files.image.name.lastIndexOf('.');
            let name=req.files.image.name.substring(0,index);
            let extension=req.files.image.name.substring(index+1);
            let randomChars=encrypt.generateSalt().substring(0,5);
            var filename=`${name}_${randomChars}.${extension}`;
            let indexoferror=filename.lastIndexOf('/');
            if(indexoferror!==-1){
                filename.replace("/", "M");
            }
            req.files.image.mv(`./public/images/profilepictures/${filename}`, function(error) {
                if(error){
                    console.log(error);
                    return res.render('register', {info: 'Cant move img'});
                }
            });
        }
        else{
            if(req.body.gender=='Male'){
                filename='maleDefault.jpg';
            }
            else{
                filename='femaleDefault.jpg';
            }
        }


      const salt = encrypt.generateSalt(); 
      const passwordHash = encrypt.hashPassword(req.body.password, salt);

      //for the role
      return Role.findOne({name: 'User'}, function(error, role) {
        if(error) {
          console.log(error);
          return res.render('register', {info: 'Database error'});
        }

        const userObject = {
          email: req.body.email,
          passwordHash: passwordHash,
          username: req.body.username,
          articles: [],
          roles: [role.id],
          salt: salt,
          profileImage: `/images/profilepictures/${filename}`,
          gender: req.body.gender
        };

        //create user
        return User.create(userObject, function(error, user) {
          if(error) {
            console.log(error);
            return res.render('register', {info: 'Database error'});
          }

          //save user to User role
          role.users.push(user.id);
          role.save(function(error) {
            if(error) {
              console.log(error);
              return res.render('register', {info: 'Database error'});
            }
            //success
            return res.redirect('login');
          });
        });
      });
    });
  });
};




/* ROUTER */
router.get('/', registerGet);
router.post('/', registerPost);




module.exports = router;
