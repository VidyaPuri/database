var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");

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
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        email: req.body.email
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
router.get("/users/:id", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", "Something went wrong!");
            res.redirect("/database");
        } else {
            console.log(foundUser.username);
            console.log(foundUser);
            res.render("users/show", {user: foundUser});
        }
    });
});

module.exports = router;