var express     = require("express");
var router      = express.Router();
var Database    = require("../models/database");
var middleware  = require("../middleware");
var User        = require("../models/user");
//var calc        = require("../calc/calc");

// INDEX
router.get("/database", middleware.isLoggedIn, function(req, res){
        //console.log(req.user.id);
    //Database.find({}, function(err, allDatabases){
    User.findById(req.user._id).populate("dataB").exec(function(err, user){
        if(err){
            console.log(err);
        } else {
            //var database = user.dataB;
            res.render("database/index", {database: user.dataB, page: 'database'});
        }
    });
});
//Database New
router.get("/database/new",middleware.isLoggedIn, function(req, res){
    res.render("database/new");
});
//Database Create
router.post("/database",middleware.isLoggedIn, function(req, res){
    var month = req.body.month;
    var year = req.body.year;
    var rate = req.body.rate;
    var bonus = req.body.bonus;
    var vacation = req.body.vacation;
    // var desc = req.body.description;
    // var owner = {
    //     id: req.user._id,
    //     username: req.user.username
    // };
    // console.log(owner);
    var newDatabase = {month: month, year: year, rate: rate, bonus: bonus, vacation: vacation};
    Database.create(newDatabase, function(err, newData){
        if(err){
            console.log(err);
        } else {
            User.findById(req.user._id, function(err, foundUser){
                if(err){
                    console.log(err);
                } else {
                    console.log("newData " +newData);
                    console.log("foundUser " + foundUser);
                    foundUser.dataB.push(newData);
                    foundUser.save(function(err, data){
                        if(err){
                            console.log(err);
                        } else {
                            console.log("data " +data);
                            console.log(calc.calcWorkdays(newData.month));
                            res.redirect("/database");
                        }
                    })
                }
            });
        }
    });
});

//Database Show

// router.get("/database", function(req, res){
//     console.log("Wakawaka");
//     res.render("database/show");
// });

module.exports = router;
