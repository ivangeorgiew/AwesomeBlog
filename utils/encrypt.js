const crypto = require('crypto');




/* ECRYPT OBJECT */
const encrypt = {
  generateSalt: function() {
    return crypto.randomBytes(128).toString('base64');
  },
  hashPassword: function(password, salt) {
    return crypto.createHmac('sha256', salt).update(password).digest('hex');
  }
};




module.exports = encrypt;
