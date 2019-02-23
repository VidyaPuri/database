var Campground  = require("../models/campground");
let Database    = require("../models/database");
var Comment     = require("../models/comment");
let moment      = require("moment");
let _           = require('lodash');

var middlewareObj = {};
middlewareObj.checkCampgroundOwnership = function(req, res, next){
        //is user logged in
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found!");
                res.redirect("back");
            } else {
                
            if (!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
                //does user own the campground?
                 if(foundCampground.author.id.equals(req.user._id)){
                    next();
                 } else {
                     req.flash("error", "You don't have permisson to do that!")
                     res.redirect("back");
                 }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!")
        res.redirect("back");
    }
};
middlewareObj.checkCommentOwnership = function(req,res,next){
  if(req.isAuthenticated()){
      Comment.findById(req.params.comment_id, function(err, foundComment){
          if(err){
              res.redirect("back");
          } else {
              if(foundComment.author.id.equals(req.user._id)){
                  next();
              } else {
                  req.flash("error", "You don't have permisson to do that!");
                  res.redirect("back");
              }
          }
      });
  } else {
      req.flash("error", "You need to be logged in to do that!");
      req.redirect("back");
  } 
};
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