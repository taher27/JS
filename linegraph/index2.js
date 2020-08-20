//Wrote this code on my own

//API to fetch historical data of Bitcoin Price Index
// const api = 'https://api.coindesk.com/v1/bpi/historical/close.json?start=2017-12-31&end=2018-12-01';

/**
 * Loading data from API when DOM Content has been loaded'.
 */
document.addEventListener("DOMContentLoaded", function(event) {
fetch(api)
    .then(function(response) { return response.json(); })
    .then(function(data) {
        var parsedData = parseData(data);
        drawChart2(parsedData);
    })
    .catch(function(err) { console.log(err); })
});

function parseData(data) {
    var arr = [];
    for (var i in data.bpi) {
        console.log(new Date(i))
        arr.push({
            date: new Date(i), //date
            value: +data.bpi[i] //convert string to number
        });
    }
    return arr;
}

function drawChart2(data) {

    var height = 400;
    var width = 600;

    var maxDate = d3.max(data, function(d) { return d.date});
    var minDate = d3.min(data, function(d) { return d.date});
    var maxBpi =  d3.max(data, function(d) { return d.value});
    var minBpi =  d3.min(data, function(d) { return d.value});

    var y = d3.scaleLinear()
                .domain([minBpi, maxBpi])
                .range([height,0]);
                
    var x = d3.scaleTime()
                .domain([minDate,maxDate])
                .range([0,width]);

    var yAxis = d3.axisLeft(y);
    var xAxis = d3.axisBottom(x);

    var svg = d3.select('body').select('#newChart').append('svg')
                .attr('height', '100%')
                .attr('width', '100%');
    
    var chartGroup = svg.append('g')
                        .attr('transform', 'translate(50, 50)')

    var line = d3.line()
                .curve(d3.curveBasis)
                .x(function(d){ return x(d.date); })
                .y(function(d){ return y(d.value); });
                    
    var area = d3.area()
                .curve(d3.curveBasis)
                .x(function(d) { return x(d.date); })
                .y0(height)
                .y1(function(d) { return y(d.value); });

    chartGroup.append("path")
            .data([data])
            .attr("class", "area")
            .attr("d", area);

    chartGroup.append('path').attr('d', line(data));
    chartGroup.append('g').attr('class', 'x axis').attr('transform', 'translate(0,'+height+')').call(xAxis)
    chartGroup.append('g').attr('class', 'y axis').call(yAxis)

}