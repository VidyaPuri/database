var express     = require("express");
var router      = express.Router();
var Database    = require("../models/database");
var middleware  = require("../middleware");
var User        = require("../models/user");
var calc        = require("../calc/calc");
var _           = require('lodash');



// INDEX
router.get("/database", middleware.isLoggedIn, function(req, res){
        //console.log(req.user.id);
    //Database.find({}, function(err, allDatabases){
    User.findById(req.user._id).populate("dataB").exec(function(err, user){
        if(err){
            console.log(err);
        } else {

            var databases = user.dataB;

            let data =[];
            let grouped = _.groupBy(databases, function(data) {
              return data.year;
            });
            
            Object.keys(grouped).forEach(function(year,index) { 
                for(let i=0;i<grouped[year].length;i++){
                    data[index]= {
                      "year": year,                 
                      "db": grouped[year]   
                  }; 
                }  
            }); 

            //console.log(JSON.stringify(data));
       
            res.render("database/index", {database: databases, groupdata: grouped, data: data, page: 'database'});
        }
    });
});
//Database New
router.get("/database/new",middleware.isLoggedIn, function(req, res){
    res.render("database/new");
});
//Database Create
router.post("/database",middleware.isLoggedIn, function(req, res){
    

    Database.find({month: req.body.month, year: req.body.year, userid: req.user._id}, function(err, found){
        if(err){
            console.log("There was some error");
        } else if(_.isEmpty(found)){
                console.log("Creating new database entry");
                var newDatabase = {};
                newDatabase = calc.calculations(req);
                console.log(newDatabase);
                Database.create(newDatabase, function(err, newData){
                    if(err){
                        console.log(err);
                    } else {
                        User.findById(req.user._id, function(err, foundUser){
                            if(err){
                                console.log(err);
                            } else {
                                foundUser.dataB.push(newData);
                                foundUser.save(function(err, data){
                                    if(err){
                                        console.log(err);
                                    } else {
                                        req.flash("success", "Entry " + req.body.month + " " + req.body.year + " added to the database.");
                                        res.redirect("/database");
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                console.log("Entry " + req.body.month + " " + req.body.year + " already exists in the database!");
                req.flash("error", "Entry " + req.body.month + " " + req.body.year + " already exists in the database. Please try again");
                res.redirect("/database/new");
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
    //console.log(req.params.id);
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
    updatedDatabase = calc.calculations(req);
    
    console.log(updatedDatabase);
    Database.findByIdAndUpdate(req.params.id, updatedDatabase, function(err, updateDatabase){
        if(err){
            res.redirect("/database");
        } else {
            res.redirect("/database/" + req.params.id);
        }
    });
});

//destroy database
router.delete("/database/:id", middleware.isLoggedIn, function(req, res){
    Database.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            console.log(err);
            res.redirect("/database/:id");
        } else {
            res.redirect("/database");
        }
    });
});

module.exports = router;
