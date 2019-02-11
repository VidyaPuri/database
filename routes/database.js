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
            //var database = user.dataB;
            //NOOOOO IDEAEEAAAAAAAAAAAAAAAAAAAAAAA
            // var years = [ 2008, 2018, 2019, 2014 ];
            // var datas = [];
            //console.log(user);
            var databases = user.dataB;
        //     //console.log("data: "+ data);

        //     //console.log("type of data: "+ typeof data);
            
        //     for(var i = 0; i<years.length;i++){
        //         databases.forEach(function(database){
        //             // console.log("years[i]: "+years[i]);
        //             // console.log("database.year: "+database.year);
        //             if(database.year === years[i]){
        //                 //console.log("id po letih: "+ database);
        //                 datas.push(database);
        //             }
        //         }
        //     )};
        //     datas.forEach(function(dejta){
        //         //console.log("dejta:" + dejta);
        //     });
        //   //console.log("data: " +datas);
            
            var grouped = _.groupBy(databases, function(data) {
              return data.year;
            });
            
            //console.log(JSON.stringify(grouped));
                //console.log("letnca: "+database.year);
                // data.push(database);
                // years.push(database.year);
            
            // console.log("Years: "+ years);
            // console.log("Data array: "+data);
            // Object.keys(data).forEach(function(year) {
            //     console.log(entry);
            // 	if(entry === year){
            // 	  year: user.dataB[entry];
            // 	  console.log("entry: " + data[entry]);
            //     }
            // });
            // console.log("years:" + years);
            res.render("database/index", {database: databases, groupdata: grouped, page: 'database'});
        }
    });
});
//Database New
router.get("/database/new",middleware.isLoggedIn, function(req, res){
    res.render("database/new");
});
//Database Create
router.post("/database",middleware.isLoggedIn, function(req, res){
    
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
