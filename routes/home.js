const router = require('express').Router();
const Article = require('mongoose').model('Article');

const home = function(req, res) {
  Article.find().limit(8).sort('-date').populate('author')
  .exec(function(error, articles) {
    if(error) {
      console.log(error);
      res.render('index', {error: error.message});
    }
    else
      res.render('index', {articles});
  });
};

const logout = function(req, res) {
  req.logOut();
  res.redirect('/');
};

router.get('/', home);
router.get('/logout', logout);

module.exports = router;
