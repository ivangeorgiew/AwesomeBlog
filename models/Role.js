const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const Role = mongoose.model('Role', mongoose.Schema({
  name: {type: String, required: true, unique: true},
  users: [{type: ObjectId, ref:'User'}]
}));

const createRoles = function(nameString) {
  Role.findOne({name: nameString}, function(error, role) {
    if(error)
      return console.log(error);

    if(!role) {
      Role.create({name: nameString}, function(error) {
        if(error) console.log(error);
      });
    }
  });
};

createRoles('User');
createRoles('Admin');

module.exports = Role;
