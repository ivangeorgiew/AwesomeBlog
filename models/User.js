const mongoose = require('mongoose');
const encrypt = require('./../utils/encrypt');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Role = mongoose.model('Role');




/* SCHEMA */
const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true},
  passwordHash: {type: String, required: true},
  username: {type: String, required: true},
  articles: [{type: ObjectId, ref: 'Article'}],
  roles: [{type: ObjectId, ref: 'Role'}],
  salt: {type: String, required: true},
  profileImage: {type: String, required: true},
  gender: {type: String, required: true},
});




/* METHODS */
userSchema.method({
  authenticate: function(password, user) {
    return encrypt.hashPassword(password, user.salt) === user.passwordHash;
  }
});




/* MODEL */
const User = mongoose.model('User', userSchema);




/* CREATE ADMIN */
const adminEmail = 'admin@mysite.com';
const adminPass = 'admin123456';

User.findOne({email: adminEmail}, function(error, admin) {
  if(error)
    return console.log(error);

  //if wasn't created yet
  if(!admin) {
    //put him in both admin and user role
    Role.findOne({name: 'Admin'}, function(error, adminRole) {
      if(error)
        return console.log(error);
      Role.findOne({name: 'User'}, function(error, userRole) {
        if(error)
          return console.log(error);

        //admin object
        const salt = encrypt.generateSalt();
        const passwordHash = encrypt.hashPassword(adminPass, salt);
        const adminUser = {
          email: adminEmail,
          passwordHash: passwordHash,
          username: 'admin',
          articles: [],
          roles: [adminRole.id, userRole.id],
          salt: salt,
          profileImage: '/images/profile/maleDefault.jpg',
          gender:'Male'
        };

        //adding to User collection
        User.create(adminUser, function(error, user) {
          if(error)
            return console.log(error);

          //adds to admin roles
          adminRole.users.push(user.id);
          adminRole.save(function(error) {
            if(error) 
              return console.log(error);
          });

          //adds to user roles
          userRole.users.push(user.id);
          userRole.save(function(error) {
            if(error) 
              return console.log(error);
          });
        });
      });
    });
  }
});




module.exports = User;
