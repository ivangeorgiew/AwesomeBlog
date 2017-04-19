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
  profileImage: {type: String}
});

userSchema.method({
  authenticate: function(password) {
    return encrypt.hashPassword(password, this.salt) === this.passwordHash;
  },
  isAuthor: function(article) {
    return (!article) ? false : this.id === article.author;
  },
  isInRole: function(roleName) {
    return Role.findOne({name: roleName}).then(function(role) {
      return (!role) ? false : this.roles.indexOf(role.id) !== -1;
    });
  }
});

const User = mongoose.model('User', userSchema);


const email = 'admin@mysite.com';
User.findOne({email: email}).then(function(admin) {
  if(admin)
    return;

  Role.findOne({name: 'Admin'}).then(function(role) {
    if(!role)
      return;

    const salt = encrypt.generateSalt();
    const passwordHash = encrypt.hashPassword('admin123456', salt);

    const adminUser = {
      email: email,
      fullName: 'Admin',
      roles: [role.id],
      salt: salt,
      articles: [],
      passwordHash: passwordHash
    };

    User.create(adminUser).then(function(user) {
      role.users.push(user.id);
      role.save();
    });
  })
});

module.exports = User;
