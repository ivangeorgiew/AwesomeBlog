const router = require('express').Router();
const Article = require('mongoose').model('Article');

router.get('/', function(req, res) {
  Article.find({}).limit(6).populate('author').then(function(articles) {
    console.log({articles});
    res.render('index.pug', {articles});
  });
});

module.exports = router;
