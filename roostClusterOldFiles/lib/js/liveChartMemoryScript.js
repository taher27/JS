var limit = 60 * 1,
    duration = 10000,
    now = new Date(Date.now() - duration)

var width = 500
var height = 240
    
var namespace = "zbio";
var type = "pods";
var memorySvg = d3.select('.memoryChart').append('svg')

var memoryPaths = memorySvg.append('g')

function tick1() {
now = new Date()
    // Add new values
    // group.data.push(group.value) // Real values arrive at irregular intervals
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        data = JSON.parse(this.responseText);
        if(type == "pods") {
            data = data.podmetrics;
        }else{
            data = data.nodemetrics;
        }
        if(data.length > 0) {
            document.getElementById("noDataMemoryMsg").style.display = "none";
            document.getElementById("memory").style.display = "block";

            data.forEach(item => {
                if(type == "pods") {
                    memory = parseInt((item.containers[0].usage.memory).slice(0, -2))/100000;   
                }else{
                    memory = parseInt((item.usage.memory).slice(0, -2))/100000;   
                }
            // checking if it is NaN or not
                if(isNaN(memory) == true || memory == Infinity){
                    memory = 0;
                }

                div = document.getElementById("memory");
                if(memory > 0) {
                    div.style.display="block";
                    document.getElementById("loadingMemory").style.display="none";
                }
                // console.log(memoryGroup)
                for (var name in memoryGroup) {
                    var group = memoryGroup[name];
                    if(item.metadata.name == group.name){
                      // console.log(group.name)
                        // memory = parseInt((item.containers[0].usage.memory).slice(0, -2))/100000   
                      // console.log(memory)   
                        group.data.push(memory)
                        group.path.attr('d', memoryLine)
                    }
                }   
            });
        }
        else {
            document.getElementById("noDataMemoryMsg").style.display = "block";
            document.getElementById("memory").style.display = "none";
        }
    }}
    // Shift domain
    x.domain([now - (limit - 2) * duration, now - duration])

    // Slide x-axis left
    x_axis.transition().duration(duration).ease(d3.easeLinear).call(x.axis);

    // Slide paths left
    memoryPaths.attr('transform', null)
        .transition()
        .duration(duration)
        .ease(d3.easeLinear)
        .attr('transform', 'translate(' + x(now - (limit - 1) * duration) + ')')
        .on('end', tick1)

    // Remove oldest data point from each group
    for (var name in memoryGroup) {
        var group = memoryGroup[name]
        group.data.shift()
    }  
    xmlhttp.open('POST', 'https://localhost:60001/api/metrics/'+namespace+'?type='+type+'&labelSelector&fieldSelector=', true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.setRequestHeader('ZBIO_CLUSTER_KEY', KEY);
    xmlhttp.send();           
}

function loadMemoryData() {
    document.getElementById("memoryHeading").innerHTML = "";
    memorypods = "";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        data = JSON.parse(this.responseText);
        if(type == "pods") {
            data = data.podmetrics;
        }else{
            data = data.nodemetrics;
        }
        data.forEach(item => {
            var colour = generateRandomColor()
            var data_func = d3.range(limit).map(function() { return -5})
            memorypods += "<h4><span style='color:"+colour+";'> "+item.metadata.name+" </span></h4>"
                memoryGroup[item.metadata.name] = {
                    name: item.metadata.name,
                    value: 0,
                    color: colour,
                    data: data_func,
                    path : memoryPaths.append('path')
                            .data([data_func])
                            .attr('class', name + ' group')
                            .style('stroke', colour)
                }
            })
            document.getElementById("memoryHeading").innerHTML = memorypods;

    }}
    xmlhttp.open('POST', 'https://localhost:60001/api/metrics/'+namespace+'?type='+type+'&labelSelector&fieldSelector=', true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.setRequestHeader('ZBIO_CLUSTER_KEY', KEY);
    xmlhttp.send();

}

function reloadMemoryData() {
    cleanMemorySvg();
    loadMemoryData();
    tick1();
}

function cleanMemorySvg() {
    memorySvg.remove();
    memoryGroup = {};
    
    x = d3.scaleTime()
        .domain([now - duration, now - (limit - 2)])
        .range([0, 500])

    y = d3.scaleLinear()
        .domain([0, 100])
        .range([height - 10, 0])

    memoryLine = d3.line()
        .curve(d3.curveBasis)
        .x(function(d, i) {
            return x(now - (limit - 5 - i) * duration)
        })
        .y(function(d) {
            return y(d)
        })

    memorySvg = d3.select('.memoryChart').append('svg')
        .attr('class', 'chart')
        .attr('width', width)
        .attr('height', height + 50)
    
    x_axis = memorySvg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(30,' + height+ ')')
        .call(x.axis = d3.axisBottom(x))
    
    y_axis = memorySvg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(30,'+ 10 +')')
        .call(y.axis = d3.axisLeft(y));

    memoryPaths = memorySvg.append('g');

    memorySvg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + 30)
        .attr("stroke","#9da5b4")
        .text("TIME (Minutes)");

    // add the X gridlines
    memorySvg.append("g")			
    .attr("class", "grid")
    .attr("transform", "translate(30," + height + ")")
    .call(make_x_gridlines()
        .tickSize(-height)
        .tickFormat("")
    )

    // add the Y gridlines
    memorySvg.append("g")			
    .attr("class", "grid")
    .attr('transform', 'translate(35,'+ 10 +')')
    .call(make_y_gridlines()
        .tickSize(-width)
        .tickFormat("")
    )   
}