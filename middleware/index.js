let Database    = require("../models/database");
let moment      = require("moment");
let _           = require('lodash');

var middlewareObj = {};
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
};
middlewareObj.entryExists = async function(req, res, next){
    let found = await Database.find({date: req.body.date, userid: req.user._id}).exec();
    if(_.isEmpty(found)){
        next();
    } else {
        req.flash("error", "Entry " + moment(req.body.date).format("MMMM") + " " + moment(req.body.date).format("YYYY") + " already exists in the database. Please try different one");
        res.redirect("/database/new");
    }
};
middlewareObj.editExists = async function(req, res, next){
    let entry = await Database.findById(req.params.id);
    if(entry.date === req.body.date){
        next();
    } else {
        let found = await Database.find({date: req.body.date, userid: req.user._id}).exec();
        if(_.isEmpty(found)){
            next();
        } else {
            req.flash("error", "Entry " + moment(req.body.date).format("MMMM") + " " + moment(req.body.date).format("YYYY") + " already exists in the database. Please try different one");
            res.redirect("/database/new");
        }
    }
};
module.exports  = middlewareObj;