const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const Role = mongoose.model('Role', mongoose.Schema({
  name: {type: String, required: true, unique: true},
  users: [{type: ObjectId, ref:'User'}]
}));

const createRoles = function(nameString) {
  Role.findOne({name: nameString})
  .then(function(role) {
    if(!role) {
      Role.create({name: nameString})
      .then(function(){})
      .catch(function(error){
        console.log(error);
      });
    }
  })
  .catch(function(error) {
    console.log(error);
  });
};

createRoles('User');
createRoles('Admin');

module.exports = Role;
