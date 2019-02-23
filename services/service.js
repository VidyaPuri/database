let Database    = require("../models/database");
let User        = require("../models/user");
let calc        = require("../calc/calc");
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
service.createData = async function(req){
    let data ={}
    console.log("Creating new database entry");
    let newDatabase = calc.calculations(req);
    let newData = await Database.create(newDatabase);
    let foundUser = await User.findById(req.user._id).exec();
    foundUser.dataB.push(newData);
    data = await foundUser.save();
    return data;
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
service.prepareChartData = async function(data, year){
    let payements =[];
    let months = [];
    let database = {};
    let sortedData = await service.sortedMonths(data);
    Object.keys(sortedData).forEach(function(idx){
        for(let i=0;i<sortedData[idx].db.length;i++){
            if(sortedData[idx].year === year){
            payements.push(sortedData[idx].db[i].payement);
            months.push(data[idx].db[i].month);
            database[i] =(sortedData[idx].db[i]);
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
};
service.sortedMonths = async function(data){ 
    let newData = [];
    let newDB = [];
    Object.keys(data).forEach(function(idx){
        newDB[idx] = service.indexedMonths(data[idx].db)
        newData[idx]={
            "year": data[idx].year,
            "db": newDB[idx]
        }
    });
    return newData;
};
service.indexedMonths = function(m){
    let months = ["January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"];
        m.sort(function(a,b){
            return months.indexOf(a.month)- months.indexOf(b.month);
        })
    return m;
};
module.exports = service;