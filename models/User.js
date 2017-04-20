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
  profileImage: {type: String, required: true, default:'/images/default.jpg'}
});

//!!!!!!!!! TRY TO REMOVE this
userSchema.method({
  authenticate: function(password) {
    return encrypt.hashPassword(password, this.salt) === this.passwordHash;
  },
  isAuthor: function(article) {
    return (!article) ? false : this.id === article.author;
  },
  isInRole: function(roleName) {
    return Role.findOne({name: roleName})
            .then(function(role){
              if(!role)
                return false;
              return this.roles.indexOf(role.id) > -1;
            })
            .catch(function(err) {
              console.log(err);
            });
  }
});

const User = mongoose.model('User', userSchema);

// From here on we create the admin profile and add it to the db
const adminEmail = 'admin@mysite.com';
const adminPass = 'admin123456';

User.findOne({email: adminEmail})
.then(function(admin) {
  if(!admin) {
    Role.findOne({name: 'Admin'})
    .then(function(role) {
      const salt = encrypt.generateSalt();
      const passwordHash = encrypt.hashPassword(adminPass, salt);

      const adminUser = {
        email: adminEmail,
        fullName: 'Admin',
        roles: [role.id],
        salt: salt,
        articles: [],
        passwordHash: passwordHash
      };

      User.create(adminUser)
      .then(function(user) {
        role.users.push(user.id);
        role.save();
      })
      .catch(function(error) {
        console.log(error);
      });
    })
    .catch(function(error) {
      console.log(error);
    });
  }
})
.catch(function(error) {
  console.log(error);
});

module.exports = User;
