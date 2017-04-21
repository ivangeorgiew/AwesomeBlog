const router = require('express').Router();
const Article = require('mongoose').model('Article');

const createGet = function(req, res) {
  res.render('article/create');
};

const createPost = function(req, res) {
  if(!req.isAuthenticated())  
    return res.render('article/create', {error: 'You must be logged in!'});
  if(!req.body.title)
    return res.render('article/create', {error: 'You didn\'t enter a title!'});
  if(!req.body.content)
    return res.render('article/create', {error: 'You didn\'t enter content!'});

  req.body.author = req.user.id;
   
  Article.create(req.body, function(error, article) {
    if(error) {
      console.log(error);
      return res.render('article/create', {error: 'Database error'});
    }

    req.user.articles.push(article.id);
    req.user.save(function(error) {
      if(error) {
        console.log(error);
        return res.render('article/create', {error: 'Database error'});
      }
      res.redirect('/');
    });
  });
};

router.get('/create', createGet);
router.post('/create', createPost);

module.exports = router;
