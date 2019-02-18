let User    = require("../models/user");
let _           = require('lodash');
let service = {};

service.getData = function(req){
        console.log("id: "+ req.user._id);
        User.findById(req.user._id).populate("dataB").exec(function(err, user){
        if(err){
            console.log(err);
        } else {

            let databases = user.dataB;

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
            return data;
        }
    });
}


module.exports = service;