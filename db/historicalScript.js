// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%I:%M:%S");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.timestamp); })
    .y(function(d) { return y(d.value); });
  
// append the svg obgect to the body of the page // appends a 'group' element to 'svg' // moves the 'group' element to the top left margin
var svg = d3.select("body").select("div").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


var pods = "zbio-broker-group1-1";
var data = [];
var time = "1584727545";

function draw(pdata) {
  svg = d3.select("body").select("div").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    var data = pdata[0].metrics;
    console.log(data)
  // format the data
  
  data.forEach(function(d) {
      d.timestamp = new Date(d.timestamp);
      console.log(d.timestamp)
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
    .call(d3.axisLeft(y));
}

// Get the data
function drawChart(pods, time) {
  var t = new Date();
  t = parseInt(t.getTime().toString().slice(0,-3))
  console.log(t);

  d3.json("http://localhost:60000/api/podmetrics/default?pod="+pods+"&collection=podcpu&start="+time+"&end="+t, function(error, data) {
  if (error) throw error;
    draw(data);
    });
}

function loadPods() {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            var pods = myArr.pods;
            var out="";
            pods.forEach(item => {
                if(item.metadata.name == "zbio-broker-group1-0"){
                    out += "<option value='"+item.metadata.name+"' selected>"+ item.metadata.name+"</option>";
                }
                else{
                    out += "<option value='"+item.metadata.name+"'>"+ item.metadata.name+"</option>";
                }
            });
            document.getElementById("podSelect").innerHTML = out;
        }
    };
    xmlhttp.open("GET", 'http://localhost:60000/api/scrape/default?type=all&labelSelector&fieldSelector', true);
    xmlhttp.send();
}
loadPods();

function subMinutes(date, minutes) {
  return date.getTime() - minutes*60000;
}

$("#podSelect").change(function(){
  d3.selectAll("svg").remove();
  pods = this.value;
  drawChart(pods, time);
});
$("#timeSelect").change(function(){
  d3.selectAll("svg").remove();
  time = this.value;
  time = subMinutes(new Date(), time)
  time = parseInt(time.toString().slice(0,-3))
  // console.log(time)
  drawChart(pods, time);
});

