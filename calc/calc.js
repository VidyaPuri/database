var calc = {};
var workdays = {
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
    Object.keys(workdays).forEach(function(month) {
    	if(mesec === month){
    	    workDays = workdays[month];
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

module.exports = calc;