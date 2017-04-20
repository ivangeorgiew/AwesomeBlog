const router = require('express').Router();
const Article = require('mongoose').model('Article');

router.get('/', function(req, res) {
  Article.find().limit(6).populate('author')
  .then(function(articles) {
    res.render('index', {articles});
  })
  .catch(function(err) {
    res.render('index', {err});
  });
});

module.exports = router;
