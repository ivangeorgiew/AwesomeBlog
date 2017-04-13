const User = require('mongoose').model('User');
const Roles= require('mongoose').model('Role');
const Article=require('mongoose').model('Article');
const encryption = require('./../utilities/encryption');

module.exports = {
    registerGet: (req, res) => {
        res.render('user/register');
    },

    registerPost:(req, res) => {
        let registerArgs = req.body;

        User.findOne({email: registerArgs.email}).then(user => {
            let errorMsg = '';
            if (user) {
                errorMsg = 'User with the same username exists!';
            } else if (registerArgs.password !== registerArgs.repeatedPassword) {
                errorMsg = 'Passwords do not match!'
            }

            if (errorMsg) {
                registerArgs.error = errorMsg;
                res.render('user/register', registerArgs)
            } else {
                let salt = encryption.generateSalt();
                let passwordHash = encryption.hashPassword(registerArgs.password, salt);

                let image=req.files.image;
                if(image){

                    let filename=image.name;

                    image.mv(`./public/images/${filename}`, err => {
                        if(err){
                            console.log(err.message);
                        }
                    });

                }

                let roles= [];
                Roles.findOne({name: 'User'}).then(role => {
                    roles.push(role.id);

                    let userObject= {
                        email:registerArgs.email,
                        passwordHash: passwordHash,
                        fullName: registerArgs.fullName,
                        salt: salt,
                        roles: roles,
                        profileImage: `/images/${image.name}`
                    };
                    User.create(userObject).then(user => {
                        role.users.push(user.id);
                        role.save(err => {
                            if(err){
                                res.render('user/register', {error: err.message})
                            } else{
                                req.logIn(user, (err) => {
                                    if (err) {
                                        registerArgs.error = err.message;
                                        res.render('user/register', registerArgs);
                                        return;
                                    }

                                    res.redirect('/')
                                })
                            }
                        });
                    })
                });
            }
        })
    },

    loginGet: (req, res) => {
        res.render('user/login');
    },

    loginPost: (req, res) => {
        let loginArgs = req.body;

        User.findOne({email: loginArgs.email}).then(user => {
            if (!user ||!user.authenticate(loginArgs.password)) {
                console.log(user.authenticate(loginArgs.password));
                let errorMsg = 'Either username or password is invalid!';
                loginArgs.error = errorMsg;
                res.render('user/login', loginArgs);
                return;
            }

            req.logIn(user, (err) => {
                if (err) {
                    console.log(err);
                    res.redirect('/user/login', {error: err.message});
                    return;
                }

               let returnUrl='/';
                if(req.session.returnUlr){
                    returnUrl=req.session.returnUlr;
                    delete req.session.returnUlr;

                }
                res.redirect(returnUrl);

            })
        })
    },

    logout: (req, res) => {
        req.logOut();
        res.redirect('/');
    },
    details: (req,res) => {

        if(!req.isAuthenticated()){

            res.redirect('/user/login');
            return;
        }
        res.render('user/profile');

    },
    editProfileGet: (req,res) => {

        res.render('user/editProfile');

    },
    editProfilePost: (req, res) => {
        let editArgs = req.body;
        let id=req.user.id;
        let salt = encryption.generateSalt();
        let passwordHash = encryption.hashPassword(editArgs.password, salt);

        let image=req.files.image;
        let thereisImage=false;
        let filename='';
        if(image){
            thereisImage=true;
            filename=image.name;

            image.mv(`./public/images/${filename}`, err => {
                if(err){
                    console.log(err.message);
                }
            });

        }

        if(thereisImage) {

            User.update({_id: id}, {$set:
                { passwordHash: passwordHash,
                 profileImage: `/images/${filename}`,
                 salt: salt
                }}).then(arr =>{
             res.redirect(`/user/details`);
             });
        }
        else{
        User.update({_id: id}, {$set:
            {
                 passwordHash: passwordHash,
                 salt: salt
                }}).then(arr => {
                    res.redirect(`/user/details`);
            });

        }
    },
    ownArticles: (req,res) => {
        Article.find({author : req.user.id}).populate('author').then(articles => {

            res.render('user/ownArticles', {
                articles
            });
        })
    }

};
