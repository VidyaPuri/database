let calendar = require("../calc/calendar");
let moment   = require('moment');

let calc = {};
calc.constants = {
    malica: 6.12,
    prevoz: 37,
    dopust: 12.28,
    prazniki: 12.28,
    bolniska: 12.28,
    prispevki: 22.10,
    davek: 22.2,
    avg_monthly_h: 174
}

calc.daysNet = function(workDays,vacDays,sickDays){
    return workDays- vacDays - sickDays;
};
calc.calcHours = function(days){
    return days*8;
};
calc.monthlyPayement = function(rate, bonus, hours){
    var payout = rate * hours + bonus;
    return payout;
};
calc.grossBase = function(rate, work_h, sick_h, vac_h, holiday_h){
    calc.gross_base = work_h*rate + vac_h * calc.constants.dopust + sick_h * calc.constants.bolniska + holiday_h * calc.constants.prazniki;
    return Number(calc.gross_base);
}
calc.grossNPU = function(maxNPU, metNPU, work_h){
    calc.gross_NPU = (maxNPU * metNPU * work_h)/ calc.constants.avg_monthly_h;
    return Number(calc.gross_NPU);
}
calc.grossPayment = function(gross_base, gross_NPU, bonus){
    let gross_payment = (gross_base + gross_NPU + bonus);
    return gross_payment;
}
calc.costBenefits = function(work_days){
    let cost_benefits = calc.constants.malica * work_days + calc.constants.prevoz;
    return cost_benefits;
}
calc.socialContributions= function(grossPayment){
    let social_contributions = grossPayment * (calc.constants.prispevki/100);
    return social_contributions;
}
calc.taxContributions = function(grossPayment){
    let tax_contributions = grossPayment * (calc.constants.davek/100);
    return tax_contributions;
}
calc.netSalary = function(gross_payment,social_contributions, tax_contributions){
    let net_salary = gross_payment - social_contributions - tax_contributions;
    return net_salary;
}
calc.netPayment = function(net_salary, cost_benefits){
    let net_payment = net_salary + cost_benefits;
    return net_payment;
}


calc.calculations = async function(req){
    let parameters = {};
    
    parameters.country = 'SI';
    parameters.year = Number(moment(req.body.date).format("YYYY"));
    parameters.month = Number(moment(req.body.date).format("MM"));
    let monthData = await calendar.getMonthData(parameters); 
    var database ={};
    //Date
    database.month = moment(req.body.date).format("MMMM");
    database.year = Number(moment(req.body.date).format("YYYY"));
    database.date = req.body.date;
    //Payment inputs
    database.rate = Number(req.body.rate);
    database.bonus = Number(req.body.bonus);
    let maxNPU = Number(req.user.maxNPU);
    let metNPU = Number(req.user.metNPU);
    //Worktime
    database.vacation = Number(req.body.vacation);
    database.sickleave = Number(req.body.sickleave);
    database.holiday = monthData.holidays;
    database.workdays = monthData.workdays;
    //Net workdays
    database.netdays = calc.daysNet(database.workdays, database.vacation, database.sickleave);
    //Hour calculation
    database.workhours = calc.calcHours(database.netdays);
    let sickhours = calc.calcHours(database.sickleave);
    let vacationhours = calc.calcHours(database.vacation);
    let holidayhours = calc.calcHours(database.holiday);

    //Payement calculation
    database.grossbase = Number(calc.grossBase(database.rate, database.workhours, sickhours, vacationhours, holidayhours).toFixed(2));
    database.grossNPU = Number(calc.grossNPU(maxNPU, metNPU, database.workhours).toFixed(2));
    database.grosspayment = Number(calc.grossPayment(database.grossbase,database.grossNPU,database.bonus).toFixed(2));
    
    database.costbenefits = Number(calc.costBenefits(database.workdays).toFixed(2));
    //console.log("costbenefits: ", database.costbenefits);
    database.socialcontributions = Number(calc.socialContributions(database.grosspayment).toFixed(2));
    //console.log("socialcontributions: ", database.socialcontributions);
    database.taxcontributions = Number(calc.taxContributions(database.grosspayment).toFixed(2));
    //console.log("taxcontributions: ", typeof database.taxcontributions);
    database.netsalary = Number(calc.netSalary(database.grosspayment, database.socialcontributions, database.taxcontributions).toFixed(2));
    database.netpayment = Number(calc.netPayment(database.netsalary, database.costbenefits).toFixed(2));
    //console.log("netpayment: ", typeof database.netpayment +" "+ database.netpayment);

    database.userid = req.user._id;
    //console.log("database: ", JSON.stringify(database))
    return database;
}


module.exports = calc;