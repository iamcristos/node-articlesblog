const express= require('express');
const router =  express.Router();
const bcrypt= require('bcryptjs');
const passport= require('passport')


let user= require('../models/user');

router.get('/register', function(req,res){
    res.render('register')
    })

//my post route

router.post('/register', function(req,res){
    //get all our form values
    const name= req.body.name;
    const username=req.body.username;
    const email= req.body.email;
    const password= req.body.password
    const password2=req.body.password2

    //validate registration form
    req.checkBody('name','Name is required').notEmpty();
    req.checkBody('username','Username is required').notEmpty();
    req.checkBody('email','Email dont match').isEmail();
    req.checkBody('email','Email is not valid').isEmail();
    req.checkBody('password','password is required').notEmpty();
    req.checkBody('password2','password dont match').equals(req.body.password);

    let errors= req.validationErrors();

    if (errors) {
        res.render('register', {
            errors:errors
        });
    }
    else {
        let newUser= new user({
            name: name,
            username: username,
            email: email,
            password: password
        });

    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password,salt,function(err, hash){
            if (err){
                console.log(err)
            } 
            newUser.password=hash;
            console.log(hash)

            newUser.save(function(err){
                if (err) {
                    console.log(err)
                    return;
                } else {
                    req.flash('success', 'successfully registerd');
                    res.redirect('/users/login')
                }
            })
        })
        
    })
    }
    
});
//creating a login routes
router.get('/login', function(req,res){
    res.render('login')
})
//creating a post routes
router.post('/login', function(req,res,next){
    passport.authenticate('local', {
        successRedirect:'/',
        failureRedirect:'/users/login',
        failureFlash: true
    })(req,res,next) 
})
//logout route
router.get('/logout', function(req,res){
    req.logout();
    req.flash('success', 'Log out successfully');
    res.redirect('/users/login')
})
module.exports= router