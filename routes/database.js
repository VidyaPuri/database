var express     = require("express");
var router      = express.Router();
var Database    = require("../models/database");
var middleware  = require("../middleware");
var User        = require("../models/user");
var calc        = require("../calc/calc");

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
    var rate = Number(req.body.rate);
    var bonus = Number(req.body.bonus);
    var vacation = Number(req.body.vacation);
    
    var workDays = calc.calcWorkdays(month);
    var netDays = calc.daysNet(workDays, vacation);
    var workHours = calc.calcHours(netDays);
    var monthlyPayement = calc.monthlyPayement(rate, bonus, workHours);
    // var desc = req.body.description;
    // var owner = {
    //     id: req.user._id,
    //     username: req.user.username
    // };
    console.log("Working hours: " + workHours);
    console.log("Monthly payement: " + monthlyPayement);
    var newDatabase = {
        month: month,
        year: year, 
        rate: rate,
        bonus: bonus,
        vacation: vacation,
        workdays: workDays,
        netdays: netDays,
        workhours: workHours,
        payement: monthlyPayement
    };
    Database.create(newDatabase, function(err, newData){
        if(err){
            console.log(err);
        } else {
            User.findById(req.user._id, function(err, foundUser){
                if(err){
                    console.log(err);
                } else {
                    // console.log("newData " +newData);
                    // console.log("foundUser " + foundUser);
                    foundUser.dataB.push(newData);
                    foundUser.save(function(err, data){
                        if(err){
                            console.log(err);
                        } else {
                            // console.log("data " +data);
                            console.log("izbran mesec: " + newData.month);
                            console.log("st delovnih dni: " + calc.calcWorkdays(newData.month));
                            res.redirect("/database");
                        }
                    });
                }
            });
        }
    });
});

//Database Show
router.get("/database/:id", function(req, res){
    Database.findById(req.params.id, function(err, foundDatabase){
      if(err){
          console.log(err);
      } else {
          res.render("database/show", {database: foundDatabase});
      } 
    });
});
//Database Edit
router.get("/database/:id/edit", function(req, res) {
    console.log(req.params.id);
    Database.findById(req.params.id, function(err, foundDatabase){
        if(err){
            console.log(err);
        } else {
        res.render("database/edit", {database: foundDatabase});
        }
    });
});

// router.get("/database", function(req, res){
//     console.log("Wakawaka");
//     res.render("database/show");
// });

module.exports = router;
