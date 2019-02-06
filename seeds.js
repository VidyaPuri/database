var mongoose    = require("mongoose");
var Campground  = require("./models/campground");
var Comment     = require("./models/comment");

var data = [
    {
    name: "Coca Cola",
    image: "https://pixabay.com/get/ed33b3082ff21c22d2524518b7444795ea76e5d004b014459cf0c87cafefb7_340.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vehicula neque lectus, eu mollis ipsum gravida bibendum. Sed non risus nisi. Sed blandit vestibulum lacus non scelerisque. Nam rhoncus sapien ut egestas volutpat. Aenean ornare lacus ut pharetra vestibulum. Nam consequat porta nisi ac porta. Donec dignissim, eros vitae blandit faucibus, turpis lacus viverra massa, vitae vehicula diam tortor ut eros. Ut mauris diam, eleifend ac feugiat non, finibus vitae arcu. Duis volutpat, ante quis vulputate porttitor, leo velit suscipit nisi, quis consequat dui magna sit amet velit."
    },
    {
    name: "Ice ice baby",
    image: "https://pixabay.com/get/e837b30b20f4053ed1584d05fb1d4e97e07ee3d21cac104491f9c170a2e5b7ba_340.jpg",
    description: "Phasellus ut congue enim. In id vestibulum augue. Quisque tincidunt dictum dui, vel maximus elit gravida quis. Praesent viverra et quam quis consequat. Suspendisse potenti. Nunc at nibh tellus. Duis eleifend condimentum nisl, commodo varius lorem gravida dictum. Quisque eget massa lectus. Nullam eu laoreet velit. Phasellus maximus dolor et vehicula congue. Nulla vulputate ex tortor, at porttitor risus volutpat eget. Maecenas sapien dolor, semper in leo sed, egestas hendrerit ante. Nunc euismod aliquet dui sed dapibus. Interdum et malesuada fames ac ante ipsum primis in faucibus."
    },
    {
    name: "Non-alcoholic beer",
    image: "https://pixabay.com/get/ea36b60729f7073ed1584d05fb1d4e97e07ee3d21cac104491f9c170a2e5b7ba_340.jpg",
    description: "Suspendisse semper, lorem ac malesuada commodo, nisl sem semper risus, ac condimentum turpis turpis non dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam vel tincidunt nisi, non iaculis purus. Aliquam dignissim ante id nunc ultricies vestibulum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus condimentum orci in sollicitudin ornare. Donec vestibulum mauris lorem, ac aliquet ante iaculis nec. Aliquam condimentum consectetur ex, eu aliquet libero egestas id. Sed ornare ullamcorper libero vitae auctor."
    }
]

function seedDB(){
    // remove all campgrounds
    Campground.deleteMany({}, function(err){
        if(err){
            console.log(err);
        } else {
            console.log("removed campgrounds!");
            //add a few campgrounds
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("added a campground");
                        //create a comment 
                        Comment.create(
                            {
                                text: "This place is great, but i wish there was internet",
                                author: "Homer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created a new comment!");
                                }
                            });
                    }
                });
            });
        };
    });
};

module.exports = seedDB;