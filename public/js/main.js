import {apiServices} from './service.api.js';
import {buildChart} from './chart.js';


console.log(window.location.pathname)
apiServices.httpGetAsync("/getCharData", (data)=>{
    data = JSON.parse(data);
    let arrData = data.chartData;
    buildChart(arrData);
});