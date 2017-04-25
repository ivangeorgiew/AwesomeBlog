const mongoose = require('mongoose');
const encrypt = require('./../utils/encrypt');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Role = mongoose.model('Role');

const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true},
  passwordHash: {type: String, required: true},
  fullName: {type: String, required: true},
  articles: [{type: ObjectId, ref: 'Article'}],
  roles: [{type: ObjectId, ref: 'Role'}],
  salt: {type: String, required: true},
  profileImage: {type: String, required: true}
});

userSchema.method({
  authenticate: function(password, user) {
    return encrypt.hashPassword(password, user.salt) === user.passwordHash;
  },
  isAuthor: function(article, user) {
    return (!article) ? false : user.id === article.author;
  },
  isInRole: function(roleName, user) {
    return Role.findOne({name: roleName}, function(error, role) {
      if(error)
        return console.log(error);
      if(!role)
        return false;

      return user.roles.indexOf(role.id) > -1;
    });
  }
});

const User = mongoose.model('User', userSchema);

// From here on we create the admin profile and add it to the db
const adminEmail = 'admin@mysite.com';
const adminPass = 'admin123456';

User.findOne({email: adminEmail}, function(error, admin) {
  if(error)
    return console.log(error);
  if(!admin) {
    Role.findOne({name: 'Admin'}, function(error, adminRole) {
      if(error)
        return console.log(error);
      Role.findOne({name: 'User'}, function(error, userRole) {
        if(error)
          return console.log(error);

        const salt = encrypt.generateSalt();
        const passwordHash = encrypt.hashPassword(adminPass, salt);
        const adminUser = {
          email: adminEmail,
          passwordHash: passwordHash,
          fullName: 'Admin',
          articles: [],
          roles: [adminRole.id, userRole.id],
          salt: salt,
          profileImage: '/images/default.jpg'
        };

        User.create(adminUser, function(error, user) {
          if(error)
            return console.log(error);

          adminRole.users.push(user.id);
          adminRole.save(function(error) {
            if(error) console.log(error);
          });
          userRole.users.push(user.id);
          userRole.save(function(error) {
            if(error) console.log(error);
          });
        });
      });
    });
  }
});

module.exports = User;
