const router = require('express').Router();
const Article = require('mongoose').model('Article');

const home = function(req, res) {
  Article.find().limit(8).populate('author').sort({date: -1})
  .exec(function(error, articles) {
    if(error) {
      console.log(error);
      return res.render('index', {error: 'Database error'});
    }
    return res.render('index', {articles});
  });
};

const logout = function(req, res) {
  req.logOut();
  return res.redirect('/');
};

router.get('/', home);
router.get('/logout', logout);

module.exports = router;
