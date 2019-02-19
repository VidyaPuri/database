let User    = require("../models/user");
let _           = require('lodash');
let service = {};

service.getData = async function(req){
     return User.findById(req.user._id).populate("dataB")
        .exec()
        .then((user)=>{
            let data = this.groupData(user);
            //console.log("json parsed: " +JSON.stringify(data));
            return data;
    })
    .catch((err)=>{
        return(err);
    });
        
};

service.groupData = function(user){
    let data =[];
        let grouped = _.groupBy(user.dataB, function(data) {
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
    return data;
};

module.exports = service;