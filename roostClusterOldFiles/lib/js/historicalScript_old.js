// set the dimensions and margins of the graph
// KEY = "LocalKey/949f90d5037af06faf3343e993376a56";
KEY = "";
fs = require('fs');

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.timestamp); })
    .y(function(d) { return y(d.value); });
  // var offsetLeft = document.getElementById("line").offsetLeft;
  
// append the svg object to the body of the page // appends a 'group' element to 'svg' // moves the 'group' element to the top left margin
var svg = d3.select("body").select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

// add the X gridlines
svg.append("g")			
.attr("class", "grid")
.attr("transform", "translate(0," + height + ")")
.call(make_x_gridlines()
    .tickSize(-height)
    .tickFormat("")
)

// add the Y gridlines
svg.append("g")			
.attr("class", "grid")
.call(make_y_gridlines()
    .tickSize(-width)
    .tickFormat("")
)

var pods = "";
var nodes = "";
var data = [];
var time = subMinutes(new Date(), 15)
time = parseInt(time.toString().slice(0,-3))
var namespace = "zbio";
var type = "pods";

var screen = "live"; // live/static

$('.historicalSelects').hide();

// gridlines in x axis function
function make_x_gridlines() {		
  return d3.axisBottom(x)
      .ticks(5)
}

// gridlines in y axis function
function make_y_gridlines() {		
  return d3.axisLeft(y)
      .ticks(5)
}

// Add the X Axis
svg.append("g")
.attr('class', 'axis')
.attr("transform", "translate(0," + height + ")")
.call(d3.axisBottom(x));

// Add the Y Axis
svg.append("g")
.attr('class', 'axis')
.attr("transform", "translate(0," + 10 + ")")
.call(d3.axisLeft(y));

function toggle() {
  $('#static').toggle();
  $('#live').toggle();
  $('.historicalSelects').toggle();

  var chartButton = document.getElementById('chartbutton');
  if(chartButton.style.color != 'white') {
    chartButton.style.color = 'white';
    screen = "static";
  }else {
    chartButton.style.color = '';
    screen = "live";
  }
  refreshScreen();
  // drawChart(pods, time)
}

function draw(pdata) {
  d3.select("body").select("#chart").selectAll("svg").remove();
  svg = d3.select("body").select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  console.log(pdata)

  if(pdata != null){
    var data = pdata[0].metrics;
    // format the data
      document.getElementById("noDataMsg").style.display = "none";
      if(data != null) {
        data.forEach(function(d) {
            d.timestamp = new Date(d.timestamp);
            // console.log(d.timestamp)
            // if(d.value == "NaN" ){
            //   d.value = 0;
            // }
            d.value = +d.value/100;
            // d.memory = +d.memory;
        });
        
        // sort years ascending
        data.sort(function(a, b){
          return a["timestamp"]-b["timestamp"];
        })
        
        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.timestamp; }));
        y.domain([0, d3.max(data, function(d) {
          // return Math.max(d.value, d.memory); 
          return Math.max(d.value, 0);   })]);
          
        // Add the valueline path.
        svg.append("path")
            .data([data])
            .attr("class", "valueline")
            .attr("d", valueline);
  
        // Add the X Axis
        svg.append("g")
          .attr('class', 'axis')
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));
  
        // Add the Y Axis
        svg.append("g")
          .attr('class', 'axis')
          .attr("transform", "translate(0," + 10 + ")")
          .call(d3.axisLeft(y));

          // add the X gridlines
        svg.append("g")			
          .attr("class", "grid")
          .attr("transform", "translate(0," + height + ")")
          .call(make_x_gridlines()
            .tickSize(-height)
            .tickFormat("")
          )

        // add the Y gridlines
        svg.append("g")			
          .attr("class", "grid")
          .call(make_y_gridlines()
            .tickSize(-width)
            .tickFormat("")
          )
      }

    }else{
      document.getElementById("noDataMsg").style.display = "block";
      document.getElementById("noDataMsg").innerHTML = "Unable to fetch data for this call."
    } 
}

// Get the data to paint for pods
function drawChart(pods, time) {
  var t = new Date();
  t = parseInt(t.getTime().toString().slice(0,-3))

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      data = JSON.parse(this.responseText);
      if(data != null) {
        draw(data);
      }
      else {
        document.getElementById("noDataMsg").style.display = "block";
        document.getElementById("noDataMsg").innerHTML = "Cluster is not running";
      }
    }};
    xmlhttp.open('POST', "https://localhost:60001/api/podmetrics/"+namespace+"?pod="+pods+"&collection=podcpu&start="+time+"&end="+t, true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.setRequestHeader('ZBIO_CLUSTER_KEY', KEY);
    xmlhttp.send();
}

// Get the data to paint for nodes
function drawChartforNodes(nodes, time) {
  var t = new Date();
  t = parseInt(t.getTime().toString().slice(0,-3))
  // console.log(t);
  // console.log(nodes)
  
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      data = JSON.parse(this.responseText);
      if(data != null) {
        draw(data);
      }
      else {
        document.getElementById("noDataMsg").style.display = "block";
        document.getElementById("noDataMsg").innerHTML = "Cluster is not running";
      }
    }};
    xmlhttp.open('POST', "https://localhost:60001/api/nodemetrics?nodes="+nodes+"&start="+time+"&end="+t, true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.setRequestHeader('ZBIO_CLUSTER_KEY', KEY);
    xmlhttp.send();
}

function loadPods(namespace) {
  console.log("loadpods called in historical")

  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
          var myArr = JSON.parse(this.responseText);
          var _pods = myArr.pods;
          var out="";
          var flag = false;
          if(_pods != null) {
            _pods.forEach(item => {
              if(flag == false) {
                flag = true;
                pods = item.PodInfo.metadata.name;
                out += "<option value='"+item.PodInfo.metadata.name+"' selected>"+ item.PodInfo.metadata.name+"</option>";
              }
              else{
                  out += "<option value='"+item.PodInfo.metadata.name+"'>"+ item.PodInfo.metadata.name+"</option>";
              }
            });
            document.getElementById("podSelect").innerHTML = out;
            document.getElementById("podHeading").innerHTML = pods;
            drawChart(pods, time);
          }
          else {
            pods = "";
            document.getElementById("podSelect").innerHTML = "";
            document.getElementById("podHeading").innerHTML = pods;
            drawChart(pods, time);
          }
      }
  };
  xmlhttp.open("POST", 'https://localhost:60001/api/scrape/'+namespace+'?type=pods&labelSelector&fieldSelector', true);
  xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xmlhttp.setRequestHeader('ZBIO_CLUSTER_KEY', KEY);
  xmlhttp.send();
}

function loadNodes(namespace) {
  console.log("loadNodes called in historical");

  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
          var myArr = JSON.parse(this.responseText);
          var _nodes = myArr.nodes;
          var out="";
          var flag = false;
          // console.log(_nodes);
          if(_nodes != null) {
            _nodes.forEach(item => {
                if(flag == false) {
                  flag = true;
                  nodes = item.metadata.name;
                  out += "<option value='"+item.metadata.name+"' selected>"+ item.metadata.name+"</option>";
                }
                else{
                    out += "<option value='"+item.metadata.name+"'>"+ item.metadata.name+"</option>";
                }
            });
            document.getElementById("podSelect").innerHTML = out;
            document.getElementById("podHeading").innerHTML = nodes;
            drawChartforNodes(nodes, time);
          }
          else {
            nodes = "";
            document.getElementById("podSelect").innerHTML = "";
            document.getElementById("podHeading").innerHTML = nodes;
            drawChartforNodes(nodes, time);
          }
      }
  };
  xmlhttp.open("POST", 'https://localhost:60001/api/scrape/'+namespace+'?type=nodes&labelSelector&fieldSelector', true);
  xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xmlhttp.setRequestHeader('ZBIO_CLUSTER_KEY', KEY);
  xmlhttp.send();
}

function subMinutes(date, minutes) {
  return date.getTime() - minutes*60000;
}

function loadNamespaces() {
  console.log("namespace called in historical")
  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
          var myArr = JSON.parse(this.responseText);
          console.log(myArr);
          var out = "";
          myArr.forEach(item => {
            if(item.metadata.name == namespace) {
              out += "<option value='" + item.metadata.name + "' selected>" + item.metadata.name + "</option>";
            }
            else {
                out += "<option value='" + item.metadata.name + "'>" + item.metadata.name + "</option>";
            }
          });
          document.getElementById("select-box").innerHTML = out;
      }};
      
  xmlhttp.open("POST", 'https://localhost:60001/api/namespaces', true);
  xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xmlhttp.setRequestHeader('ZBIO_CLUSTER_KEY', KEY);
  xmlhttp.send();
}

$('#select-box').change(() => {
  namespace = $('#select-box').val();

  if(type == "pods") {
      loadPods(namespace);
    } else{
      loadNodes(namespace);
    }
})

$("#podSelect").change(function(){
  // Historical_svg.remove();
  pods = this.value;
  nodes = this.value;
  if(type == "pods") {    // calling pods data & update heading
    document.getElementById("podHeading").innerHTML = pods;
    drawChart(pods, time);
  }
  else{   // calling nodes data & update heading
    document.getElementById("podHeading").innerHTML = nodes;
    drawChartforNodes(nodes, time)
  }
});


// $("#timeSelect").change(function(){    //Duration select is out for some time
//   // Historical_svg.remove();
//   time = this.value;
//   time = subMinutes(new Date(), time)
//   time = parseInt(time.toString().slice(0,-3))
//   // console.log(type)
//   if(type == "nodes") {
//     document.getElementById("podHeading").innerHTML = nodes;
//     drawChartforNodes(nodes, time);
//   }
//   else {
//     document.getElementById("podHeading").innerHTML = pods;
//     drawChart(pods, time);
//   }
// });

// select-resources
$("#select-resources").change(function(){
  type = this.value;

  if(type == "nodes") {
    $(".namespaceDropdown").hide();
    loadNodes(namespace);
    document.getElementById("podHeading").innerHTML = nodes;
    drawChartforNodes(nodes, time);
  }
  else if(type == "pods"){
    $(".namespaceDropdown").show();
    loadPods(namespace)
    document.getElementById("podHeading").innerHTML = pods;
    drawChart(pods, time);
  }
});

function loader() {
  $(".loader-overlay").toggle();
  setTimeout(() => {
      $(".loader-overlay").toggle();
  }, 1500)
}

function refreshScreen(){
  loadNamespaces()
  if(screen == "live") {
    //----------> what we need ? just this 2 function we are already storing all data :)
    reloadCpuData();
    reloadMemoryData();
    loader();
  }
  else if(screen == "static") {
    //----------> what we need ? => namespace, resources(node1/master), pod, time;
    if(type == "nodes") {
      document.getElementById("podHeading").innerHTML = nodes;
      drawChartforNodes(nodes, time);
      loader();
    }
    else {
      document.getElementById("podHeading").innerHTML = pods;
      drawChart(pods, time);
      loader();
    }
  }
}

function getKey() {
  fs.readFile('/var/tmp/Roost/RoostLocalKey.txt', (err, data) => {
  if (err) {
      console.error(err)
      return
      }
      KEY = data.toString()
      console.log(KEY)
  })
}
getKey()
setTimeout(() => {
  loadNamespaces();
  loadNodes(namespace);
  setTimeout(loadPods(namespace), 1000);
}, 2000)