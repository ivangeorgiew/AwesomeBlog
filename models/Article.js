const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const Article = mongoose.model('Article', mongoose.Schema({
  title: { type: String, required: true },
  content: {type: String, required:true},
  author: { type: ObjectId,required: true, ref: 'User'},
  date: {type: Date, default: Date.now()},
});

const init = function() { 
  Article; 
};

module.exports = init();
