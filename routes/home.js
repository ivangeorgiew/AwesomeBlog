const router = require('express').Router();
const Article = require('mongoose').model('Article');

const showArticles = function(req, res, obj, user) {
  return Article.find(obj).populate('author')
  .exec(function(error, articles) {
    if(error) {
      console.log(error);
      return res.render('index', {error: 'Database error'});
    }
    if(!user)
      return res.render('index', {articles, error: req.body.search});
    else {
      const arts = articles.filter(function(val) {
        return val.author.username.toLowerCase() 
        === req.body.search.split('#')[1].toLowerCase();
      });
      return res.render('index', {articles: arts, error: req.body.search});
    }
  });
};

const home = function(req, res) {
  return showArticles(req, res, {});
};

const logout = function(req, res) {
  req.logOut();
  return res.redirect('/');
};

const search = function(req, res) {
  if(!req.body.search)
    return res.render('index', {error: 'No search value entered'});

  if(/#/.test(req.body.search)){
    const arr = req.body.search.split('#');

    if(arr[0] === 'user')
      return showArticles(req, res, {}, true);

    return res.render('index', {error: 'Invalid title'});
  }

  if(req.body.search === 'own'){
    if(!req.isAuthenticated())
      return res.render('index', {error: 'You must be logged in'});

    return showArticles(req, res, {author: req.user.id});
  }

  return showArticles(req, res, {title: req.body.search});
};



router.get('/', home);
router.get('/logout', logout);
router.post('/search', search);

module.exports = router;
