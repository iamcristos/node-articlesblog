const express= require('express');
const path= require('path');
const moongoose= require('mongoose');
const bodyParser= require('body-parser');
const session= require('express-session');
const flash= require('connect-flash');
const expressValidator= require('express-validator')
const config= require('./config/database');
const passport= require('passport');
let articles = require('./models/article')


const app= express();

moongoose.connect(config.database, { useNewUrlParser: true });
let db=moongoose.connection;

db.once('open', function(){
    console.log('connected')
});

db.on('error', function(err){
    console.log(err)
})

const port= process.env.PORT  || 4000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
//middleware for body parser

app.use(bodyParser.urlencoded({ extended:true}));
app.use(bodyParser.json());

// set our static to public
app.use(express.static(path.join(__dirname, "public")));

// express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));

// express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// express validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
}));

//require passport
require('./config/passport')(passport)
//passport middleware
app.use(passport.initialize());
app.use(passport.session());
//creating universal route
app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
})

app.get('/', function(req,res) {
    // let articles= [
    //     {
    //         id: 1,
    //         title: 'kingdom principle',
    //         author: 'Milse Murone',
    //         body: 'this book is awesome'
    //     },

    //     {
    //         id: 2,
    //         title: 'Understanding the Anointing',
    //         author: 'David O Oyedepo',
    //         body: 'this book is awesome'
    //     },

    //     {
    //         id: 3,
    //         title: 'Prosperity',
    //         author: 'Kenneth Copland',
    //         body: 'this book is awesome'
    //     }

    // ]
    articles.find({}, function(err, articles){
        if (err){
            console.log(err)
        } else {
            res.render('index', {
                title: 'articles',
                articles: articles
            });
        };
    // res.render('index', {
        // articles:articles
    })
    
    
    })
// })

//getting id

//bringing the router
let articleRouter= require('./routes/article');
let userRouter= require('./routes/users')

app.use("/article", articleRouter);
app.use("/users", userRouter)

app.listen(port, function(){
    console.log('app is listening')
})