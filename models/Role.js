const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;




/* MODEL */
const Role = mongoose.model('Role', mongoose.Schema({
  name: {type: String, required: true, unique: true},
  users: [{type: ObjectId, ref:'User'}]
}));




/* CREATE ROLES */
Role.findOne({name: 'Admin'}, function(error, role) {
  if(error)
    return console.log(error);
  
  //if there isnt such role creates it
  if(!role) {
    Role.create({name: 'Admin'}, function(error) {
      if(error) 
        return console.log(error);
    });
  }
});

Role.findOne({name: 'User'}, function(error, role) {
  if(error)
    return console.log(error);
  
  //if there isnt such role creates it
  if(!role) {
    Role.create({name: 'User'}, function(error) {
      if(error) 
        return console.log(error);
    });
  }
});




module.exports = Role;
