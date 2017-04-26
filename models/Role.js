const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;




/* MODEL */
const Role = mongoose.model('Role', mongoose.Schema({
  name: {type: String, required: true, unique: true},
  users: [{type: ObjectId, ref:'User'}]
}));




/* CREATE ROLES */
const createRoles = function(nameString) {
  Role.findOne({name: nameString}, function(error, role) {
    if(error)
      return console.log(error);
    
    //if there isnt such role creates it
    if(!role) {
      Role.create({name: nameString}, function(error) {
        if(error) 
          return console.log(error);
      });
    }
  });
};

createRoles('User');
createRoles('Admin');




module.exports = Role;
