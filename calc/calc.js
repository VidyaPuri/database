let moment      = require('moment');
let calc = {};


calc.constants = {
    malica: 6.12,
    prevoz: 37,
    dopust: 12.28,
    praznik: 12.28,
    prispevki: 22.10,
    davek: 22.2 
}

let calendar = require("../calc/calendar");

calc.daysNet = function(workDays,vacDays){
    return workDays- vacDays;
};
calc.calcHours = function(days){
    return days*8;
};
calc.monthlyPayement = function(rate, bonus, hours){
    var payout = rate * hours + bonus;
    return payout;
};

calc.calculations = async function(req){
    let parameters = {};
    parameters.country = 'SI';
    parameters.year = Number(moment(req.body.date).format("YYYY"));
    parameters.month = Number(moment(req.body.date).format("MM"));
    let monthData = await calendar.getMonthData(parameters); 
    var database ={};
   
    database.month = moment(req.body.date).format("MMMM");
    database.year = Number(moment(req.body.date).format("YYYY"));
    database.date = req.body.date;
    database.rate = Number(req.body.rate);
    database.bonus = Number(req.body.bonus);
    database.vacation = Number(req.body.vacation);
    database.holiday = monthData.holidays;
    database.workdays = monthData.workdays;

    database.netdays = calc.daysNet(database.workdays, database.vacation);
    database.workhours = calc.calcHours(database.netdays);
    database.payement = calc.monthlyPayement(database.rate, database.bonus, database.workhours).toFixed(2);
    database.userid = req.user._id;

    return database;
}


module.exports = calc;