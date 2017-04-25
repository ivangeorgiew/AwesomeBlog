const router = require('express').Router();
const Article = require('mongoose').model('Article');
const User = require('mongoose').model('User');

const createGet = function(req, res) {
  if(!req.isAuthenticated())
    return res.redirect('/');
  return res.render('article/create');
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
      return res.redirect('/');
    });
  });
};

const editGet = function(req, res) {
  if(!req.isAuthenticated())
    return res.redirect('/');
  Article.findById(req.params.id, function(error, article) {
    if(error) {
      console.log(error);
      return res.render('index', {error: 'Database error'});
    }
    return res.render('article/edit', article); 
  });
};

const editPost = function(req, res) {
  if(!req.isAuthenticated())
    return res.redirect('/');

  Article.update({_id: req.params.id}, {$set:
    { title: req.body.title,
      content: req.body.content }}, function(error) {
    if(error){
      console.log(error);
      return res.render('index', {error: 'Database error'});
    }
    return res.render('article/edit', {error: 'Updated article!',
      title: req.body.title, content: req.body.content}
    ); 
  });
};

const deleteGet = function(req, res) {
  if(!req.isAuthenticated())
    return res.redirect('/');

  Article.findByIdAndRemove(req.params.id, function(error, article) {
    User.findById(article.author, function(error, user) {
      if(error) {
        console.log(error);
        return res.render('index', {error: 'Database error'});
      }
      user.articles.splice(user.articles.indexOf(article.id), 1);
      user.save(function(error) {
        if(error) {
          console.log(error);
          return res.render('index', {error: 'Database error'});
        }
        return res.render('index', {error: 'Deleted article!'});
      });
    }); 
  });
};


router.get('/create', createGet);
router.post('/create', createPost);
router.get('/edit/:id', editGet);
router.post('/edit/:id', editPost);
router.get('/delete/:id', deleteGet);

module.exports = router;
