//let calendarAPI = require('calendarific');
let  moment     = require('moment-business-days');
//let callAPI = new calendarAPI("d0e77032a65c58a0ea07eddf508c31da4dd16f2e")
let request = require('request');
let rp = require('request-promise');

let inputMonth, inputYear, inputCountry;
let parameters = {};
let calendar = {};
let weekHolidays = 0;

// inputCountry = 'SI';
// inputMonth = 1; //January
// inputYear = 2021;

// parameters.country = inputCountry;
// parameters.year = inputYear;
// parameters.month = inputMonth;


calendar.noWeekHolidays = async function(holiday, parameters){
        holiday.forEach(function(month){
            if(month.date.datetime.year === parameters.year && month.date.datetime.month === parameters.month){                                                      // only for requested month
                if(moment(month.date.datetime.day + "-" + month.date.datetime.month + "-" +month.date.datetime.year,"DD-MM-YYYY").isBusinessDay()){         // only holidays on weekdays
                    weekHolidays++;
                }
            }    
        });
        return weekHolidays;
}
calendar.getWeekDays = function(parameters){
    return moment(parameters.month + "-" + parameters.year,'MM-YYYY').monthBusinessDays().length;
}
calendar.getHolidays = async function(parameters){
    //let url = 'https://calendarific.com/api/v2/holidays?country=SI&year=2019&month=12&api_key=d0e77032a65c58a0ea07eddf508c31da4dd16f2e'
    let calendarific ={}
    calendarific.key = 'd0e77032a65c58a0ea07eddf508c31da4dd16f2e';
    calendarific.apiEndpoint = 'https://calendarific.com/api/v2/holidays'
    calendarific.querystring = '?api_key=' + calendarific.key;
    if ('object' === typeof parameters) {
        for (var parameter in parameters) {
            calendarific.querystring += '&' + parameter + '=' + parameters[parameter];
        }
      }
    url = calendarific.apiEndpoint + calendarific.querystring;
    //console.log(url);
    let holidays = await rp(url);
    holidays = JSON.parse(holidays);
    //console.log(JSON.stringify(holidays))
    return holidays;
}
calendar.getMonthData = async function(parameters){
    let yearHolidays = await calendar.getHolidays(parameters);
    let weekHolidays = await calendar.noWeekHolidays(yearHolidays.response.holidays, parameters);
    let weekDays = await calendar.getWeekDays(parameters);
    calendar.holidays = weekHolidays;
    calendar.workdays = weekDays - calendar.holidays;

    return calendar;
}   
// calendar.getMonthData(parameters)
//     .then((data)=>{
//         console.log("this:", data);
//     })

module.exports = calendar;