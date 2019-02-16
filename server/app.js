var bodyParser = require("body-parser"),
    jwt=require('jsonwebtoken'),
    methodOverride = require("method-override"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express(),
    bodyParser =require('body-parser'),
    cors = require('cors'),
    
    User = require("./Association/models/user");

// var url=  "mongodb://localhost/angulartest";
mongoose.connect("mongodb://localhost/angulartest", { useNewUrlParser: true });

app.use(cors());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(require("express-session")({
    secret: "Hello",
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.json())

function verifyToken(req,res,next){
    if(!req.headers.authorization){
        alert('sdfsr')
        return res.status(401).send('Unauthorized rew')

    }
    let token =req.headers.authorization.split(' ')[1]
    if(token == 'null'){
        alert('sdfsr')
        return res.status(401).send('Unauthorized rew')
    }
    let payload=jwt.verify(token, 'secretKey')
    if(!payload){
        alert('sdfsr')
        return res.status(401).send('Unauthorized rew') 
    }
    req.userId = payload.subject
    next()
    
}

app.get("/", function (req, res) {

    res.redirect("/index");

});

app.get("/index", function (req, res) {
    
            res.render("index");
});

app.post("/register", function (req, res) {
   let userData = req.body
   let user = new User(userData)
  
    user.save( (err,user) => {
        if (err) {
            console.log(err);
            // return res.render("auth/register");

        }else{
        // passport.authenticate("local")(req, res, function () {
            // let payload = {subject:registeredUser._id}
            // let token = jwt.sign(payload,'secretKey')
            res.status(200).send(user)
        }
    })
})

app.post('/login',(req,res) => {
    let userData =req.body
    // console.log(userData);
    
    User.findOne({'username':userData.username},(err,user) => {
        if(err){
            console.log(err);
            
        }else{
           
            if(!user){
                res.status(401).send('Invalid email')

            }else
            if(user.password !== userData.password)
            {
                res.status(401).send('Invalid Pass')

            }else{
                let payload = {subject : user._id}
                let token = jwt.sign(payload, 'secretKey')
                res.status(200).send({token})
            }
        }
    })
})


app.get('/protected',verifyToken ,function(req,res){
    let names =[
        {
            "name":"Parth"
        }
    ]
    res.json(names);
})

app.listen(process.env.PORT || 3000,function(){
    console.log("start");
    
});