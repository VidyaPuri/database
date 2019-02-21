
export function buildChart(arrData){
    //console.log(arrData)
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
}
