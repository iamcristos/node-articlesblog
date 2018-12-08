const express= require("express");
const router =  express.Router();
//Article model
let articles = require('../models/article');
// users model
let users = require('../models/user');



router.get('/add', function(req,res){
    res.render('addArticles')
});

router.post('/add', function(req,res){

    //setting validation for our article form
    req.checkBody('title','Title is required').notEmpty();
    // req.checkBody('author','Author is required').notEmpty();
    req.checkBody('body','Body is required').notEmpty();

    //getting errors if any

    let errors= req.validationErrors();

    if (errors) {
        res.render('addArticles', {
            title:'Add Articles',
            errors: errors
        })
     }
      else {
        let article= new articles()
        article.title= req.body.title;
        article.author= req.user._id;
        article.body= req.body.body;
    
        article.save(function(err){
            if (err) {
                console.log(err)
                return;
            } else {
                req.flash('success','articles added')
                res.redirect("/");
                console.log('succesfuly added data')
            }
        })
    

     }

    
});

router.get('/:id', function(req,res){
    articles.findById(req.params.id, function(error, article){
        users.findById(article.author, function(err,users){
            console.log(article)
            console.log(users)
            // user.findById(article.author, function(err, user){
                if (error) {
                    console.log(error)
                } res.render('article',{
                    article:article,
                    author:users.name 
                })
            // })
            
    
        return;
        })
        
});
});


//editing my form
router.get('/edit/:id', function(req,res){
    articles.findById(req.params.id, function(error, article){
        if (error) {
            console.log(error)
        } res.render('edit_article',{
            article:article
        })

    return;
})
});

//deleting article
router.delete('/:id', function(req,res){
    let querry= {_id:req.params.id}

    articles.remove(querry, function(error){
        if(error){
            console.log(error)
        }
        res.send(200)
        console.log('deleted')
    })
})
//posting the edited form

router.post('/edit/:id', function(req,res){
    let article= {}
    article.title= req.body.title;
    article.author= req.body.author;
    article.body= req.body.body;

    let querry= {_id:req.params.id}

    articles.update(querry, article, function(err){
        if (err) {
            console.log(err)
            return;
        } else {
            res.redirect("/");
            console.log('succesfuly updated data')
        } return;
    })

});


module.exports= router