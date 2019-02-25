let g;
let xAxisGroup;
let yAxisGroup;
export function buildChart(arrData){
 
    // console.log(arrData)
    var margin = {left: 100, right: 20, top: 20, bottom: 100};
    var width = 1200 - margin.left - margin.right;
    var height = 800 - margin.top - margin.bottom; 

    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.2);

    var y = d3.scaleLinear()
        .range([height, 0]);

    let element = document.getElementsByTagName("svg");
    // if(element.length>0){
    //     console.log(arrData);
    //     update(arrData);
    // } else {
    if(!element.length){    

    g = d3.select("#chart-area")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" +margin.left + ", "+ margin.top + ")")
   
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
    
        //x axis
    xAxisGroup = g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + height + ")")
    //y axis
    yAxisGroup = g.append("g")
        .attr("class", "y axis")
    }
    // d3.interval(function(){
    //     update(arrData)
    // }, 1000);

    update(arrData);
    

    function update(data){
        // flag = !flag
        let t = d3.transition().duration(750);
    
        x.domain(data.map(function(d) { return d.month }))
        y.domain([0, d3.max(data, function(d) {return d.pay })])
        // if(flag){
        //     y.domain([0,50000]);
        // } else {
        //     y.domain([0,30000]);
        // }
        var xAxisCall = d3.axisBottom(x);
            xAxisGroup.transition(t).call(xAxisCall);
        var yAxisCall = d3.axisLeft(y)
            .tickFormat(function(d){ return "$"+d; });
            yAxisGroup.transition(t).call(yAxisCall);    
    
        var rects = g.selectAll("rect")
            .data(data, function(d){
                return d.month;
            });
    
        //Exit old parameters
        rects.exit()
            .attr("fill", "red")
        .transition(t)
            .attr("y", y(0))
            .attr("height",0)
            .remove();  
    
        // ENTER new elements present in new data
    
        rects.enter().append("rect")
                
            .attr("width", x.bandwidth)
            .attr("x", function(d){ return x(d.month) })
            .attr("fill", "blue")
            .attr("y", y(0))
            .attr("height", 0)
            // UPDATE old elements present in new data
            .merge(rects)
            .transition(t)
                .attr("fill", "gray")
                .attr("y", function(d){ return y(d.pay); })
                .attr("x", function(d){ return x(d.month) })
                .attr("height", function(d){ return height - y(d.pay); })
                .attr("width", x.bandwidth)
        
    }
}