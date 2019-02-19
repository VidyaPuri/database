var express     = require("express");
var router      = express.Router();
var Database    = require("../models/database");
var middleware  = require("../middleware");
var User        = require("../models/user");
var calc        = require("../calc/calc");
var _           = require('lodash');
let service     = require("../services/service");

// INDEX
router.get("/database", middleware.isLoggedIn, function(req, res){    
    service.getData(req).then((data)=>{
        //console.log("klican: " +JSON.stringify(data));
        res.render("database/index", {data: data, page: 'database'});
    });
});
//json send
router.get("/getCharData", middleware.isLoggedIn, function(req, res){
        service.getData(req).then((data)=>{
        //console.log("klican: " +JSON.stringify(data));
        res.json({data: data}); 
    });
});
//Database New
router.get("/database/new",middleware.isLoggedIn, function(req, res){
    res.render("database/new");
});
//Database Create
router.post("/database",middleware.isLoggedIn, function(req, res){
    service.createData(req).then((data)=>{
        if(_.isEmpty(data)){
            req.flash("error", "Entry " + req.body.month + " " + req.body.year + " already exists in the database. Please try again");
            res.redirect("/database/new");
        } else {
            req.flash("success", "Entry " + req.body.month + " " + req.body.year + " added to the database.");
            res.redirect("/database");
        }
    }).catch((err)=>{
        return(err);
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
    //console.log(updatedDatabase);
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
