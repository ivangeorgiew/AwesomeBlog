const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const Role = mongoose.model('Role', mongoose.Schema({
  name: { type: String, required: true, unique: true},
  users: [{type: ObjectId, ref:'User'}]
}));

const init = function() {
  Role;

  Role.findOne({name: 'User'}).then(function(role) {
    if(!role)
      Role.create({name: 'User'});
  });
  Role.findOne({name: 'Admin'}).then(function(role) {
    if(!role)
      Role.create({name: 'Admin'});
  });
};

module.exports = init();
