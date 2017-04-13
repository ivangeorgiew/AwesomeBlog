const Article=require('mongoose').model('Article');



module.exports={
    createGet: (req,res)=>{
        res.render('article/create');
    },
    createPost: (req,res)=>{
        let articfleParts=req.body;
        let errorMsg='';
        if(!req.isAuthenticated()){
            errorMsg='Sorry you must be logged in!';
        }
        else if(!articfleParts.title){
            errorMsg='Title is required!';
        }
        else if(!articfleParts.content){
            errorMsg='Content is required';
        }
        if(errorMsg){
            res.render('article/create',{
                error: errorMsg
            });
            return;
        }

        let userId=req.user.id;
        articfleParts.author=userId;

        Article.create(articfleParts).then(article => {
            req.user.articles.push(article.id);
            req.user.save(err => {
                if(err){
                    res.render('article/create', {
                        error: err.message
                    });
                }
                else{
                    res.redirect('/');
                }
            })
        })
    },
    detailsGet: (req, res) => {
        let id = req.params.id;

        Article.findById(id).then(article => {
            res.render('article/details', article);
        });

    },
    editGet: (req, res) => {
        let id=req.params.id;
        if(!req.isAuthenticated()){
            let returnUrl=`/article/edit/${id}`;
            req.session.returnUlr=returnUrl;

            res.redirect('/user/login');
            return;
        }
        Article.findById(id).then(article =>{
            req.user.isInRole('Admin').then(isAdmin => {
               if(!isAdmin && !req.user.isAuthor(article)){
                   res.redirect('/');
                   return;
               }
            });
            res.render('article/edit', article);
        });
    },
    editPost: (req,res) => {
        let id=req.params.id;
        let articleArgs=req.body;

        let errorMsg='';
        if(!req.isAuthenticated()){
            errorMsg='Sorry you must be logged in!';
        }
        else if(!articleArgs.title){
            errorMsg='Title is required!';
        }
        else if(!articleArgs.content){
            errorMsg='Content is required';
        }
        if(errorMsg){
            res.render('article/edit',{
                error: errorMsg
            });
            return;
        }

        Article.update({_id: id}, {$set:
            { title: articleArgs.title,
             content: articleArgs.content
            }}).then(arr =>{
                res.redirect(`/article/details/${id}`);
        });

    },
    deleteGet: (req,res) => {
        let id=req.params.id;
        if(!req.isAuthenticated()){
            let returnUlr=`/article/delete/${id}`;
            req.session.returnUlr=returnUlr;

            res.redirect('/user/login');
            return;
        }
        Article.findById(id).then(article =>{
            req.user.isInRole('Admin').then(isAdmin =>{
                if(!isAdmin && !req.user.isAuthor(article)){
                 res.redirect('/');
                 return;
                }
            });

           res.render('article/delete', article);
        });
    },
    deletePost: (req,res) =>{
        let id=req.params.id;
        Article.findByIdAndRemove(id).then(article => {
            let index = req.user.articles.indexOf(article.id);

            req.user.articles.splice(index, 1);
            req.user.save(err =>{
                if(err){
                    res.redirect('/', { error: err.message})
                }
                else{
                    res.redirect('/');
                }
            })
        })
    },

};
