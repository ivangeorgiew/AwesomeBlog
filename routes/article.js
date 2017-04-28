const router = require('express').Router();
const Article = require('mongoose').model('Article');
const User = require('mongoose').model('User');
const fs = require('fs');


/* CREATE ARTICLE */
const createGet = function(req, res) {
  if(!req.isAuthenticated())
    return res.redirect('/');

  return res.render('article/create');
};

const createPost = function(req, res) {
  if(!req.isAuthenticated())  
    return res.render('article/create', {info: 'You must be logged in!'});
  if(!req.body.title)
    return res.render('article/create', {info: 'You didn\'t enter a title!'});
  if(!req.body.content)
    return res.render('article/create', {info: 'You didn\'t enter content!'});


  //if image is given
  if(req.files.image) {
    req.files.image.name = req.user.username + req.files.image.name;
    req.files.image.mv(`./public/images/articles/${req.files.image.name}`, function(error) {
      if(error)
        console.log(error);
    });
    req.body.picture = `/images/articles/${req.files.image.name}`;
  }

  //for the article creation
  req.body.author = req.user.id;

  return Article.create(req.body, function(error, article) {
    if(error) {
      console.log(error);
      return res.render('article/create', {info: 'Database error'});
    }

    //saves article to user
    req.user.articles.push(article.id);
    req.user.save(function(error) {
      if(error) {
        console.log(error);
        return res.render('article/create', {info: 'Database error'});
      }
      return res.redirect('/');
    });
  });
};




/* EDIT ARTICLE */
const editGet = function(req, res) {
  if(!req.isAuthenticated())
    return res.redirect('/');

  return Article.findById(req.params.id, function(error, article) {
    if(error) {
      console.log(error);
      return res.render('index', {info: 'Database error'});
    }
    return res.render('article/edit', article); 
  });
};

const editPost = function(req, res) {
  if (!req.isAuthenticated())
    return res.redirect('/');

  if (req.files.image) {
    return Article.findById(req.params.id, function(error, article) {
      if(error) {
        console.log(error);
        return res.render('user/edit', {info: 'Database error'});
      }
      fs.unlink(`./public${article.picture}`, function(error) {
        if(error)
          console.log(error);
      });

      req.files.image.name = article.id + req.files.image.name;
      req.files.image.mv(`./public/images/articles/${req.files.image.name}`, function(error) {
        if(error)
          console.log(error);
      });

      //for article updating
      req.body.image = `/images/articles/${req.files.image.name}`;

      return Article.update({_id: req.params.id}, {
        $set: {
          title: req.body.title,
          content: req.body.content,
          picture: req.body.image
        }
      }, function (error) {
        if (error) {
          console.log(error);
          return res.render('index', {info: 'Database error'});
        }
        //updates the article and sets the new data to be visible
        return res.render('article/edit', {
          info: 'Updated article!',
          title: req.body.title,
          content: req.body.content
        });
      });
    });
  }

  return Article.update({_id: req.params.id}, {
    $set: {
      title: req.body.title,
      content: req.body.content,
    }
  }, function (error) {
    if (error) {
      console.log(error);
      return res.render('index', {info: 'Database error'});
    }
    //updates the article and sets the new data to be visible
    return res.render('article/edit', {
      info: 'Updated article!',
      title: req.body.title, content: req.body.content
    })
  });
};




/* DELETE ARTICLE */
const deleteGet = function(req, res) {
  if(!req.isAuthenticated())
    return res.redirect('/');

  return Article.findByIdAndRemove(req.params.id, function(error, article) {
    if(error) {
      console.log(error);
      return res.render('index', {info: 'Database error'});
    }

    //works for either user and admin deletion
    return User.findById(article.author, function(error, user) {
      if(error) {
        console.log(error);
        return res.render('index', {info: 'Database error'});
      }

      //removes article from user collection
      user.articles.splice(user.articles.indexOf(article.id), 1);
      user.save(function(error) {
        if(error) {
          console.log(error);
          return res.render('index', {info: 'Database error'});
        }
        return res.render('index', {info: 'Deleted article!'});
      });
    }); 
  });
};




/* DETAILS */
const details = function(req,res) {
  Article.findById(req.params.id).populate('author').exec(function(error, article) {
    if(error) {
      console.log(error);
      return res.render('index', {info: 'Database error'});
    }
    return res.render('article/details', {article});
  });
};



/* ROUTER */
router.get('/create', createGet);
router.post('/create', createPost);
router.get('/edit/:id', editGet);
router.post('/edit/:id', editPost);
router.get('/delete/:id', deleteGet);
router.get('/details/:id', details);




module.exports = router;
