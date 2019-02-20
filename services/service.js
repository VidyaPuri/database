let User    = require("../models/user");
let _       = require('lodash');
let Database    = require("../models/database");
let calc        = require("../calc/calc");

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
service.createData = async function(req){
        let data ={}
        let found = await Database.find({month: req.body.month, year: req.body.year, userid: req.user._id})
            .exec()
            if(_.isEmpty(found)){
                console.log("Creating new database entry");
                let newDatabase = calc.calculations(req);
                let newData = await Database.create(newDatabase);
                let foundUser = await User.findById(req.user._id).exec();
                foundUser.dataB.push(newData);
                data = await foundUser.save();
                return data;
            } else {
                console.log("This entry already exists");
                return data;   
        };
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

service.prepareChartData = async function(data){
    let payements =[];
    let months = [];
    let database = {};
    Object.keys(data).forEach(function(idx){
        for(let i=0;i<data[idx].db.length;i++){
            if(data[idx].year === "2019"){
            payements.push(data[idx].db[i].payement);
            months.push(data[idx].db[i].month);
            database[i] =(data[idx].db[i]);
            }
        }
    });
    let arrData = [];
    Object.keys(database).forEach(function(d){
        arrData.push({
            "month": database[d].month,
            "pay": database[d].payement
        })
    });
    return arrData;
}

module.exports = service;