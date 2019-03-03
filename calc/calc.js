let moment      = require('moment');
let calc = {};

let calendar = require("../calc/calendar");

// calc.workdays = {
//     January: "21",
//     February: "19",
//     March: "22",
//     April: "19",
//     May: "21",
//     June: "20",
//     July: "22",
//     August: "22",
//     September: "20",
//     October: "22",
//     November: "21",
//     December: "19",
// };
// Zakaj tukaj ne morem prej iz loopa mi ni jasno
// calc.calcWorkdays = function(mesec){
//     var workDays;
//     Object.keys(calc.workdays).forEach(function(month) {
//     	if(mesec === month){
//     	    workDays = calc.workdays[month];
//         }
//     });
//     return  workDays;
// };
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