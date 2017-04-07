const Article = require('mongoose').model('Article');

module.exports = {
    createGet: (req, res) => {
        res.render('article/create');
    },

    createPost: (req, res) => {
        let articleArgs = req.body;

        let errorMsg = '';
        if(!req.isAuthenticated()){
            errorMsg = 'You should be logged in to make articles!'
        } else if (!articleArgs.title){
            errorMsg = 'Invalid title!';
        } else if (!articleArgs.content){
            errorMsg = 'Invalid content!';
        }

        if (errorMsg) {
            res.render('article/create', {error: errorMsg});
            return;
        }
        let image=req.files.image;
        if(image){
           let filenameAndExt=image.name;

           let filename=filenameAndExt.substr(0,filenameAndExt.lastIndexOf('.'));
           let exten=filenameAndExt.substr(filenameAndExt.lastIndexOf('.')+1);

           let rnd=require('./../utilities/encryption').generateSalt().substr(0, 5).replace('/\//g', 'x');
           let finalname=`${filename}_${rnd}.${exten}`;
           image.mv(`./public/images/${finalname}`, err => {
                if(err){
                    console.log(err.message);
                }
           });
            articleArgs.imagePath=`/images/${finalname}`;
        }

        articleArgs.author = req.user.id;

        Article.create(articleArgs).then(article => {
            req.user.articles.push(article.id);
            req.user.save(err => {
                if (err) {
                    res.redirect('/', {error: err.message});
                } else {
                    res.redirect('/');
                }
            })
        })
    },

    details: (req, res) => {
        let id = req.params.id;

        Article.findById(id).populate('author').then(article => {
            res.render('article/details', article);
        })
    },
};