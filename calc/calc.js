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
calc.calcWorkdays = function(mesec){
    Object.keys(workdays).forEach(function(month) {
	if(mesec === month){
		return workdays[month];
    }
    });
};

module.exports = calc;