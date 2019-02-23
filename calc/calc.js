let moment      = require('moment');
let calc = {};

calc.workdays = {
    January: "21",
    February: "19",
    March: "22",
    April: "19",
    May: "21",
    June: "20",
    July: "22",
    August: "22",
    September: "20",
    October: "22",
    November: "21",
    December: "19",
};
// Zakaj tukaj ne morem prej iz loopa mi ni jasno
calc.calcWorkdays = function(mesec){
    var workDays;
    Object.keys(calc.workdays).forEach(function(month) {
    	if(mesec === month){
    	    workDays = calc.workdays[month];
        }
    });
    return  workDays;
};
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

calc.calculations = function(req){
    var database ={};
    database.month = moment(req.body.date).format("MMMM");
    database.year = Number(moment(req.body.date).format("YYYY"));
    database.date = req.body.date;
    database.rate = Number(req.body.rate);
    database.bonus = Number(req.body.bonus);
    database.vacation = Number(req.body.vacation);
    database.workdays = calc.calcWorkdays(database.month);

    database.netdays = calc.daysNet(database.workdays, database.vacation);
    database.workhours = calc.calcHours(database.netdays);
    database.payement = calc.monthlyPayement(database.rate, database.bonus, database.workhours).toFixed(2);
    database.userid = req.user._id;
    return database;
}

module.exports = calc;