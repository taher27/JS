// javascript

function loadData() {
    var pods = [];
    var cpu = [];

    //http://localhost:8001/api/v1/nodes
    $.getJSON("http://localhost:60000/api/metrics/default?type=pods,nodes&labelSelector&fieldSelector=", null, function (data) {
        // START kube nodes
        $.each(data.podmetrics, function (index, item) {
            pods.push({
                "name": item.metadata.name,
                "cpu": item.containers[0].usage.cpu,
                "memory": item.containers[0].usage.memory,
            });
            cpu.push(parseInt((item.containers[0].usage.cpu).slice(0, -1)) / 1000);
            // pods.push(item.metadata.name)
        });

        //create graph
        var margin = {top: 20, right: 20, bottom: 80, left: 40};
        var svgWidth = 400, svgHeight = 300, barPadding = 25;
        sum = cpu.reduce((a, b) => a + b, 0);
        var newarr = [];
        cpu.forEach(i => {
            i = ((i * 100) / sum);
            newarr.push(i);
        });
        console.log(sum);
        console.log(newarr);

        var barWidth = (svgWidth / newarr.length);
        var barHeight = 30;

        var x = d3.scale.ordinal().rangeRoundBands([0, svgWidth], .05);

        var y = d3.scale.linear().range([svgHeight, 0]);
        // define the axis
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10);

        var svg = d3.select("body").append("svg")
            .attr("width", svgWidth + margin.left + margin.right)
            .attr("height", svgHeight + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        x.domain(pods.map(function (d) {
            return d.name;
        }));

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + svgHeight + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.60em")
            .attr("transform", "rotate(-90)");


        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 5)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("cpu");

        var yScale = d3.scale.linear()
            .domain([0, d3.max(newarr)])
            .range([0, svgHeight]);

        var barChart = svg.selectAll("rect")
            .data(newarr)
            .enter()
            .append("rect")
            .attr("y", function (d) {
                return svgHeight - yScale(d)
            })
            .attr("height", function (d) {
                return yScale(d);
            })
            .attr("width", barWidth - barPadding)
            .attr("transform", function (d, i) {
                var translate = [barWidth * i, 0];
                return "translate(" + translate + ")";
            });

        barChart.append("text")
            .attr("x", function (d) {
                return (d) - 3;
            })
            .attr("y", barHeight / 2)
            .attr("dy", ".35em")
            .text(function (d, i) {
                console.log(newarr[i]);
                return newarr[i];
            });

        // var text = svg.selectAll("text")
        // .data(newarr)
        // .enter()
        // .append("text")
        // .text(function(d) {
        //     console.log(d)
        //     return d;
        // })
        // .attr("y", function(d, i) {
        //     return svgHeight - d - 2;
        // })
        // .attr("x", function(d, i) {
        //     return barWidth * i;
        // })
        // .attr("fill", "#A64C38");

    });
}

setInterval(loadData(), 3000);