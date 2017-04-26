const router = require('express').Router();
const Article = require('mongoose').model('Article');




/* MULTI FUNCTION */
const showArticles = function(req, res, obj, user) {
  return Article.find(obj).populate('author')
  .exec(function(error, articles) {
    if(error) {
      console.log(error);
      return res.render('index', {info: 'Database error'});
    }
    
    //searching by title or own
    if(!user)
      return res.render('index', {articles, info: req.body.search});

    const arts = articles.filter(function(val) {
      return val.author.username.toLowerCase() 
      === req.body.search.split('#')[1].toLowerCase();
    });
    
    //searching by user
    return res.render('index', {articles: arts, info: req.body.search});
  });
};




/* HOME */
const home = function(req, res) {
  return showArticles(req, res, {});
};




/* LOGOUT */
const logout = function(req, res) {
  req.logOut();
  return res.redirect('/');
};




/* SEARCH */
const search = function(req, res) {
  if(!req.body.search)
    return res.render('index', {info: 'No search value entered'});

  if(/#/.test(req.body.search)){
    const arr = req.body.search.split('#');
    //valid search for user
    if(arr[0] === 'user')
      return showArticles(req, res, {}, true);

    return res.render('index', {info: 'Invalid title'});
  }

  if(req.body.search === 'own'){
    if(!req.isAuthenticated())
      return res.render('index', {info: 'You must be logged in'});

    //all of current user's articles
    return showArticles(req, res, {author: req.user.id});
  }

  //search by title
  return showArticles(req, res, {title: req.body.search});
};




/* ROUTER */
router.get('/', home);
router.get('/logout', logout);
router.post('/search', search);




module.exports = router;
