import {apiServices} from './service.api.js';
import {buildChart} from './chart.js';

window.onload=function(){

  let yearLinks = document.querySelectorAll(".nav-link.year");
  
  yearLinks.forEach((year)=>{
    year.addEventListener("click", getYear);
  });
  
function getYear(){
  console.log(event.target.name);
  let year = event.target.name;
  //let loc = window.location.pathname;
  //if(window.location.pathname == "/database"){
    apiServices.httpGetAsync("/getCharData?year="+year, (data)=>{
      data = JSON.parse(data);
      let arrData = data.chartData;
      buildChart(arrData);
  });
  }

}