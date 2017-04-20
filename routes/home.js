const router = require('express').Router();
const Article = require('mongoose').model('Article');

router.get('/', function(req, res) {
  Article.find().limit(6).populate('author')
  .exec(function(error, articles) {
    if(error)
      res.render('index', {err});
    else
      res.render('index', {articles});
  });
});

module.exports = router;
