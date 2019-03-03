let middleware  = require("../middleware");
let Database    = require("../models/database");
let service     = require("../services/service");
let express     = require("express");
let moment      = require("moment");
let calc        = require("../calc/calc");
let _           = require('lodash');


var router      = express.Router();

// INDEX
router.get("/database", middleware.isLoggedIn, function(req, res){    
    service.getData(req).then((data)=>{
        //console.log("klican: " +JSON.stringify(data));
        service.sortedMonths(data).then((newData)=>{
            res.render("database/index", {data: newData, page: 'database'})
        });
    }).catch((err)=> {return(err)});
});
//json send
router.get("/getCharData", middleware.isLoggedIn, function(req, res){
        service.getData(req).then((data)=>{
        service.prepareChartData(data,req.query.year)
        .then((chartData)=>{
            // console.log(chartData);
            res.json({chartData: chartData})
        });    
    }).catch((err)=> {return(err)});
});
//Database New
router.get("/database/new",middleware.isLoggedIn, function(req, res){
    res.render("database/new");
});
//Database Create
router.post("/database",middleware.isLoggedIn, middleware.entryExists, function(req, res){
    service.createData(req).then((data)=>{
            req.flash("success", "Entry " + moment(req.body.date).format("MMMM") + " " + moment(req.body.date).format("YYYY") + " added to the database.");
            res.redirect("/database");
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
router.put("/database/:id",middleware.isLoggedIn,middleware.editExists, async function(req, res){
    var updatedDatabase ={};
    // console.log(req.body.date);
    // console.log(req.body.month);
    // console.log(req.body.vacation);
    updatedDatabase = await calc.calculations(req);
    console.log("updated database: ",updatedDatabase);
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
