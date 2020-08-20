var limit = 60 * 1,
    duration = 10000,
    now = new Date(Date.now() - duration)

var width = 500
var height = 240

namespace = "zbio";
type = "pods";
var cpuSvg = d3.select('.graph').append('svg')

var paths = cpuSvg.append('g')

function tick() {
    console.log("In tick");

    now = new Date()
    // Add new values
    // group.data.push(group.value) // Real values arrive at irregular intervals
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          data  = JSON.parse(this.responseText);
          if(type == "pods") {
            data = data.podmetrics;
            //console.log(data);
        }else{
            data = data.nodemetrics;
            //console.log(data);
        }
            data.forEach(item => {
            // console.log(data);  
                if(type == "pods") {
                    cpu = parseInt((item.containers[0].usage.cpu).slice(0, -2))/100000;   
                }else{
                    cpu = parseInt((item.usage.cpu).slice(0, -2))/1000000;   
                }
                // checking if it is NaN or not
                if(isNaN(cpu) == true || cpu == Infinity){
                    cpu = 0;
                }
                div = document.getElementById("cpu");
                if(cpu > 0) {
                    div.style.display="block";
                    document.getElementById("loadingCpu").style.display="none";
                }
                for (var name in cpuGroups) {
                    var group = cpuGroups[name];
                    if(item.metadata.name == group.name){
                        // console.log(group.name)
                        // cpu = parseInt((item.containers[0].usage.cpu).slice(0, -1))/100000   
                        // console.log(cpu)   
                        group.data.push(cpu)
                        // console.log(group.path)
                        group.path.attr('d', cpuLine)
                    }
                }   
            });
        }}
        // Shift domain
        x.domain([now - (limit - 2) * duration, now - duration]);

// dynamix y-axis code: in progress
        // y.domain([0, d3.max(data, function(d) {
        //     if(type == "pods") {
        //         if(d.metrics != undefined) {
        //             return Math.max(d.metrics[0].value, 0);   
        //         } else {
        //             // console.log(parseInt((d.containers[0].usage.cpu).slice(0, -2))/10000)
        //             return Math.max(parseInt((d.containers[0].usage.cpu).slice(0, -2))/10000, 0);
        //         }
        //     } else{
        //         if(d.metrics != undefined) {
        //             return Math.max(d.metrics[0].value, 0);   
        //         } else {
        //             // console.log(parseInt((d.usage.cpu).slice(0, -2))/1000000)
        //             return Math.max(parseInt((d.usage.cpu).slice(0, -2))/1000000, 0);
        //         }
        //     } 
        // })]);

        // Slide x-axis left
        axis.transition().duration(duration).ease(d3.easeLinear).call(x.axis);

        // Slide paths left
        paths.attr('transform', null)
            .transition()
            .duration(duration)
            .ease(d3.easeLinear)
            .attr('transform', 'translate(' + x(now - (limit - 1) * duration) + ')')
            .on('end', tick)

        // Remove oldest data point from each group
        for (var name in cpuGroups) {
            var group = cpuGroups[name]
            group.data.shift()
        }   
    xmlhttp.open('POST', 'https://localhost:60001/api/metrics/'+namespace+'?type='+type+'&labelSelector&fieldSelector=', true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.setRequestHeader('ZBIO_CLUSTER_KEY', KEY);
    xmlhttp.send();         
}

// function generateRandomColor() { var letters = '0123456789ABCDEF'; var color = '#'; for (var i = 0; i < 6; i++) { color += letters[Math.floor(Math.random() * 16)];} return color; }

function generateRandomColor() {
    var letters = 'BCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}

function  loadCpuData() {
// console.log("in loadCpuData");
document.getElementById("cpuHeading").innerHTML = "";
  cpupods = "";
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        data  = JSON.parse(this.responseText);

        if(data.podmetrics != null) {
            data = data.podmetrics;
        }else{
            data = data.nodemetrics;
        }
        if(data.length > 0) {
            document.getElementById("noDataCpuMsg").style.display = "none";
            document.getElementById("cpu").style.display = "block";

            data.forEach(item => {
                var colour = generateRandomColor()
                var data_func = d3.range(limit).map(function() { return -5})
                cpupods += "<h4><span style='color:"+colour+";'> "+item.metadata.name+" </span></h4>"
                    cpuGroups[item.metadata.name] = {
                        name: item.metadata.name,
                        value: 0,
                        color: colour,
                        data: data_func,
                        path : paths.append('path')
                                .data([data_func])
                                .attr('class', name + ' group')
                                .style('stroke', colour)
                    }
                });
                document.getElementById("cpuHeading").innerHTML = cpupods;
        }else{
            document.getElementById("noDataCpuMsg").style.display = "block";
            document.getElementById("cpu").style.display = "none";
        }

    }}
    xmlhttp.open('POST', 'https://localhost:60001/api/metrics/'+namespace+'?type='+type+'&labelSelector&fieldSelector=', true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.setRequestHeader('ZBIO_CLUSTER_KEY', KEY);
    xmlhttp.send();

}

$("#select-box").change(function(){
    namespace = $(this).val();
    reloadCpuData();
    reloadMemoryData();

    setTimeout(() => {
        refreshScreen();
    }, 1500);
});

$("#select-resources").change(function(){
   type = $("#select-resources").val();
    reloadCpuData();
    reloadMemoryData();

    setTimeout(() => {
        refreshScreen();
    }, 1500);
});

function reloadCpuData() {
    cleanCpuSvg()
    loadCpuData();
    tick();
}

function cleanCpuSvg(){
    cpuSvg.remove();
    cpuGroups = {}


    x = d3.scaleTime()
        .domain([now - duration, now - (limit - 2)])
        .range([0, width])

    y = d3.scaleLinear()
        .domain([0, 100])
        .range([height - 10, 0])

    cpuLine = d3.line()
        .curve(d3.curveBasis)
        .x(function(d, i) {
            return x(now - (limit - 5 - i) * duration)
        })
        .y(function(d) {
            return y(d)
        })

    cpuSvg = d3.select('.graph').append('svg')
        .attr('class', 'chart')
        .attr('width', width)
        .attr('height', height + 50)

    axis = cpuSvg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(30,' + height+ ')')
        .call(x.axis = d3.axisBottom(x))

    yaxis = cpuSvg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(30,'+ 10 +')')
        .call(y.axis = d3.axisLeft(y))

    paths = cpuSvg.append('g');

    cpuSvg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + 30)
        .attr("stroke","#9da5b4")
        .text("TIME (Minutes)");

    // add the X gridlines
    cpuSvg.append("g")			
    .attr("class", "grid")
    .attr("transform", "translate(30," + height + ")")
    .call(make_x_gridlines()
        .tickSize(-height)
        .tickFormat("")
    )

    // add the Y gridlines
    cpuSvg.append("g")			
    .attr("class", "grid")
    .attr('transform', 'translate(35,'+ 10 +')')
    .call(make_y_gridlines()
        .tickSize(-width)
        .tickFormat("")
    )
}

setTimeout(() => {
    refreshScreen();
    // loadCpuData();
    // tick();
}, 3000)