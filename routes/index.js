var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");
var middleware  = require("../middleware");
//root route
router.get("/", function(req, res){
    res.render("landing");
});

//show reg form
router.get("/register", function(req, res) {
    res.render("register", {page: 'register'});
});

// signup logic
router.post("/register", function(req, res) {
    var newUser = new User({
        username: req.body.username,
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        avatar: req.body.avatar,
        country: req.body.country,
        city: req.body.city
    });
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// show login form
router.get("/login", function(req, res) {
    res.render("login", {page: 'login'});
});

// handling login logic
router.post("/login", passport.authenticate("local", 
    {
    successRedirect: "/database",
    failureRedirect: "/login"
    }), function(req, res){
});

// logout form
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

//show user profile form
router.get("/users/:id", middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", "Something went wrong!");
            res.redirect("/database");
        } else {
            // console.log(foundUser.username);
            // console.log(foundUser);
            // console.log("avatar: " +foundUser.avatar);
            // console.log("id: "+ foundUser._id);
            res.render("users/show", {user: foundUser});
        }
    });
});

//edit user profile form
router.get("/users/:id/edit", middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            res.render("users/edit", {user: foundUser});
        }
    });
});
//user update
router.put("/users/:id", function(req, res){
    
    var updatedUser = {
        username: req.body.username,
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        avatar: req.body.avatar,
        country: req.body.country,
        city: req.body.city,
        description: req.body.description
    };
    
    console.log(updatedUser);
    User.findOneAndUpdate(req.params.id, updatedUser, function(err, updateUser){
        if(err){
            res.redirect("/users/" + req.params.id);
            console.log("error " + err);
        } else {
            res.redirect("/users/" + req.params.id);
            console.log("updateUser: " + updateUser);
        }
    });
});

router.delete("/users/:id", function(req, res){
    User.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/users/:id");
        }else{
            res.redirect("/");
        }
    });
});

module.exports = router;