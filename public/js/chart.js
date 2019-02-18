let data;

var xmlHttp = new XMLHttpRequest();
xmlHttp.open( "GET", "/getCharData", false ); // false for synchronous request
xmlHttp.send( null );
data = xmlHttp.responseText;

// var svg = d3.select("#chart-area").append("svg")
// 	.attr("width", 500)
// 	.attr("height", 400);

// var line = svg.append("line")
//     .attr("x1", 15)
//     .attr("y1", 40)
//     .attr("x2", 145)
//     .attr("y2", 160)
//     .attr("stroke", "gray")
//     .attr("stroke-width", 5);

// var rect = svg.append("rect")
//     .attr("x", 200)
//     .attr("y", 300)
//     .attr("width",180)
//     .attr("height", 71)
//     .attr("fill", "green");

// svg.append("ellipse")
//     .attr("cx", 250)
//     .attr("cy", 225)
//     .attr("rx", 100)
//     .attr("ry", 35)
//     .attr("fill", "purple");
    
//console.log(data);
data = JSON.parse(data);
console.log(data);
let payements =[];
let months = [];
let database = {};

Object.keys(data.data).forEach(function(idx){
    console.log("idx: "+ idx);
    for(let i=0;i<data.data[idx].db.length;i++){
        if(data.data[idx].year === "2019"){
        console.log(data.data[idx].db[i].month+ " : " +data.data[idx].db[i].payement);
        payements.push(data.data[idx].db[i].payement);
        months.push(data.data[idx].db[i].month);
        console.log(data.data[idx].db[i]);
        database[i] =(data.data[idx].db[i]);
        }
    }
});
console.log("payements: "+ payements);
console.log("months:" + months);
console.log(database);

let arrData = [];
Object.keys(database).forEach(function(d){
        console.log(database[d]);
        console.log("d: "+ d);
        arrData.push({
            "month": database[d].month,
            "pay": database[d].payement
        })
    });
// ============================= IZRIS GRAFA =====================================================


var margin = {left: 100, right: 20, top: 20, bottom: 100};
var width = 1200 - margin.left - margin.right;
var height = 800 - margin.top - margin.bottom;



var g = d3.select("#chart-area")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" +margin.left + ", "+ margin.top + ")");

    // X label

g.append("text")
    .attr("y", height + 40)
    .attr("x", width /2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Month");

// Y label

g.append("text")
    .attr("x", -height/2)
    .attr("y", -60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Revenue");

var x = d3.scaleBand()
    .domain(arrData.map(function(d) { return d.month }))
    .range([0, width])
    .padding(0.2);


var y = d3.scaleLinear()
    .domain([0, d3.max(arrData, function(d) { return d.pay })])
    .range([height, 0]);
    
//x axis
var xAxis = d3.axisBottom(x);
g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0, " + height + ")")
    .call(xAxis);
//y axis
var yAxis = d3.axisLeft(y)
    .tickFormat(function(d){
    return "$"+d;
    });
g.append("g")
    .attr("class", "y axis")
    .call(yAxis);
    
var rects = g.selectAll("rect")
            .data(arrData)
        .enter()
            .append("rect")
            .attr("y", function(d){
                return y(d.pay)
            })
            .attr("x", function(d){
                return x(d.month);
            })
            .attr("width", x.bandwidth)
            .attr("height", function(d){
                return height - y(d.pay);
            })
            
            .attr("fill", function(d) {
                return "blue";
            });


// });
