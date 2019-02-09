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
    // console.log("Working hours: " + workHours);
    // console.log("Monthly payement: " + monthlyPayement);
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
                            res.redirect("/database");
                        }
                    });
                }
            });
        }
    });
});

//Database Show
router.get("/database/:id",middleware.isLoggedIn, function(req, res){
    Database.findById(req.params.id, function(err, foundDatabase){
      if(err){
          console.log(err);
      } else {
            res.render("database/show", {database: foundDatabase});
      } 
    });
});
//Database Edit
router.get("/database/:id/edit",middleware.isLoggedIn, function(req, res) {
    console.log(req.params.id);
    Database.findById(req.params.id, function(err, foundDatabase){
        if(err){
            console.log(err);
        } else {
        res.render("database/edit", {database: foundDatabase});
        }
    });
});
//Database update
router.put("/database/:id",middleware.isLoggedIn, function(req, res){
    var updatedDatabase ={};
    
    updatedDatabase.month = req.body.month;
    updatedDatabase.year = req.body.year;
    updatedDatabase.rate = Number(req.body.rate);
    updatedDatabase.bonus = Number(req.body.bonus);
    updatedDatabase.vacation = Number(req.body.vacation);

    updatedDatabase.workdays = calc.calcWorkdays(updatedDatabase.month);
    updatedDatabase.netdays = calc.daysNet(updatedDatabase.workdays, updatedDatabase.vacation);
    updatedDatabase.workhours = calc.calcHours(updatedDatabase.netdays);
    updatedDatabase.payement = calc.monthlyPayement(updatedDatabase.rate, updatedDatabase.bonus, updatedDatabase.workhours);
    
    console.log(updatedDatabase);
    Database.findByIdAndUpdate(req.params.id, updatedDatabase, function(err, updateDatabase){
        if(err){
            res.redirect("/database");
        } else {
            res.redirect("/database/" + req.params.id);
        }
    });
});


module.exports = router;
