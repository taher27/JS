// set the dimensions and margins of the graph
// var margin = {top: 20, right: 200, bottom: 100, left: 50},
//     margin2 = { top: 430, right: 10, bottom: 20, left: 40 },
//     width1 = 960 - margin.left - margin.right,
//     height1 = 500 - margin.top - margin.bottom,
//     height2 = 500 - margin2.top - margin2.bottom;

// var parseDate = d3.timeFormat("%Y%m%d").parse;
// var bisectDate = d3.bisector(function(d) { return d.date; }).left;

// var xScale = d3.scaleTime()
//     .range([0, width1]),

//     xScale2 = d3.scaleTime()
//     .range([0, width1]); // Duplicate xScale for brushing ref later

// var yScale = d3.scaleLinear()
//     .range([height1, 0]);

// // 40 Custom DDV colors 
// // scale ordinal is not used in d3 so scalband is used instead.
// var color =  d3.scaleOrdinal().range(["#48A36D", "Blue", "Red", "Green", "Brown","#80CCB3", "#7FC9BD", "#56AE7C",  "#64B98C", "Purple", "Gray", "Orange", "Maroon", "Aquamarine", "Coral", "Fuchsia", "Wheat", "Lime", "Crimson", "Khaki", "Hot pink", "Magenta", "Olden", "Plum", "Olive", "Cyan", "#8897CE", "#8F90CD", "#9788CD", "#9E81CC", "#7EC4CF", "#7FBBCF", "#7FB1CF", "#80A8CE", "#AA81C5", "#B681BE", "#C280B7", "#CE80B0", "#D3779F", "#D76D8F", "#DC647E", "#E05A6D", "#E16167"]);
// var xAxis = d3.axisBottom()
//     .scale(xScale),

//     xAxis2 = d3.axisBottom() // xAxis for brush slider
//     .scale(xScale2);

// var yAxis = d3.axisLeft()
//     .scale(yScale); 

// var line = d3.line()
//     .curve(d3.curveBasis)
//     .x(function(d) { return xScale(d.date); })
//     .y(function(d) { 
//       if(typeof d.rating !== "number"){
//         d.rating = 0;
//       }
//       return yScale(d.rating); 
//     })
//     .defined(function(d) { 
//       if(typeof d.rating !== "number"){
//         d.rating = 0;
//       }
//       return d.rating; 
//     });  // Hiding line value defaults of 0 for missing data

// var maxY; // Defined later to update yAxis

// var svg = d3.select("body").select("#chart1").append("svg")
//     .attr("width", width1 + margin.left + margin.right)
//     .attr("height", height1 + margin.top + margin.bottom) //height + margin.top + margin.bottom
//   .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// // Create invisible rect for mouse tracking
// svg.append("rect")
//     .attr("width", width1)
//     .attr("height", height1)                                    
//     .attr("x", 0) 
//     .attr("y", 0)
//     .attr("id", "mouse-tracker")
//     .style("fill", "white"); 

// //for slider part-----------------------------------------------------------------------------------
  
// var context = svg.append("g") // Brushing context box container
//     .attr("transform", "translate(" + 0 + "," + 410 + ")")
//     .attr("class", "context");

// // append clip path for lines plotted, hiding those part out of bounds
// svg.append("defs")
//   .append("clipPath") 
//     .attr("id", "clip")
//     .append("rect")
//     .attr("width", width1)
//     .attr("height", height1); 

//end slider part----------------------------------------------------------------------------------- 
    
// KEY = "LocalKey/07ebcef3db1962e500f716d70859ab72";
KEY = "";
fs = require('fs');

var maxY; // Defined later to update yAxis
var pods = "";
var nodes = "";
var data = [];
var time = 0;
var namespace = "zbio";
var type = "pods";

var screen = "live"; // live/static

$('.historicalSelects').hide();

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
}

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

function loadNamespaces() {
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
  console.log("calling collectPods....");
  collectPods();
})

// select-resources
$("#select-resources").change(function(){
  type = this.value;
  collectPods();

  if(type == "nodes") {
    $(".namespaceDropdown").hide();
  }
  else if(type == "pods"){
    $(".namespaceDropdown").show();
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
    // collectPods();
      loader();
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

setTimeout(() => {
  loadNamespaces();
}, 2000);


function draw(data) {
  //   console.log(data)
  color.domain(d3.keys(data[0]).filter(function(key) { // Set the domain of the color ordinal scale to be all the csv headers except "date", matching a color to an issue
      return key !== "date"; 
    }));
  
    // data.forEach(function(d) { // Make every date in the csv data a javascript date object format
    //   d.date = parseDate(d.date)
    //   // console.log(d.date)
    // });
  
    var categories = color.domain().map(function(name) { // Nest the data into an array of objects with new keys
  
      return {
        name: name, // "name": the csv headers except date
        values: data.map(function(d) { // "values": which has an array of the dates and ratings  
        if(typeof (d[name]) !== "number") {
          (d[name]) = 0;
        }
        return {
            date: d.date,
            rating: +(d[name]),
            };
        }),
        visible: (name === "zbio-service-0" ? true : false) // "visible": all false except for economy which is true.
      };
    });
  
    xScale.domain(d3.extent(data, function(d) { return d.date; })); // extent = highest and lowest points, domain is data, range is bouding box
  
    yScale.domain([0, 100
      //d3.max(categories, function(c) { return d3.max(c.values, function(v) { return v.rating; }); })
    ]);
  
    xScale2.domain(xScale.domain()); // Setting a duplicate xdomain for brushing reference later
   
   //for slider part-----------------------------------------------------------------------------------

   var brush = d3.brushX() //for slider bar at the bottom
      .extent([[xScale2.range()[0], 0], [xScale2.range()[1], height2]])
      // .x(xScale2) 
      .on("brush", brushed);

    context.append("g") // Create brushing xAxis
        .attr("class", "x axis1")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);
  
    var contextArea = d3.area() // Set attributes for area chart in brushing context graph
    .curve(d3.curveMonotoneX)
      .x(function(d) { return xScale2(d.date); }) // x is scaled to xScale2
      .y0(height2) // Bottom line begins at height2 (area chart not inverted) 
      .y1(0); // Top line of area, 0 (area chart not inverted)
  
      console.log(categories)
    //plot the rect as the bar at the bottom
    context.append("path") // Path is created using svg.area details
      .attr("class", "area")
      .attr("d", contextArea(categories[0].values)) // pass first categories data .values to area path generator 
      .attr("fill", "#F1F1F2");
      
    // append the brush for the selection of subsection  
    context.append("g")
      .attr("class", "x brush")
      .call(brush)
      .selectAll("rect")
      .attr("height", height2) // Make brush rects same height 
        .attr("fill", "grey");  // #E6E7E8
    //end slider part-----------------------------------------------------------------------------------
  
    // draw line graph
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height1 + ")")
        .call(xAxis);
  
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("x", -10)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        // .text("Issues Rating");
  
    var issue = svg.selectAll(".issue")
        .data(categories) // Select nested data and append to new svg group elements
      .enter().append("g")
        .attr("class", "issue");   
  
    issue.append("path")
        .attr("class", "line")
        .style("pointer-events", "none") // Stop line interferring with cursor
        .attr("id", function(d) {
          return "line-" + d.name.replace(" ", "").replace("/", ""); // Give line id of line-(insert issue name, with any spaces replaced with no spaces)
        })
        .attr("d", function(d) { 
          // console.log(d.values)
          return d.visible ? line(d.values) : null; // If array key "visible" = true then draw line, if not then don't 
        })
        .attr("clip-path", "url(#clip)")//use clip path to make irrelevant part invisible
        .style("stroke", function(d) { return color(d.name); });
  
    // draw legend
    var legendSpace = 450 / categories.length; // 450/number of issues (ex. 40)    
  
    issue.append("rect")
        .attr("width", 10)
        .attr("height", 10)                                    
        .attr("x", width1 + (margin.right/3) - 15) 
        .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace) - 8; })  // spacing
        .attr("fill",function(d) {
          return d.visible ? color(d.name) : "#F1F1F2"; // If array key "visible" = true then color rect, if not then make it grey 
        })
        .attr("class", "legend-box")
  
        .on("click", function(d){ // On click make d.visible 
          d.visible = !d.visible; // If array key for this data selection is "visible" = true then make it false, if false then make it true
  
          maxY = findMaxY(categories); // Find max Y rating value categories data with "visible"; true
          yScale.domain([0,(maxY+50)]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true
          svg.select(".y.axis")
            .transition()
            .call(yAxis);   
  
          issue.select("path")
            .transition()
            .attr("d", function(d){
              return d.visible ? line(d.values) : null; // If d.visible is true then draw line for this d selection
            })
  
          issue.select("rect")
            .transition()
            .attr("fill", function(d) {
            return d.visible ? color(d.name) : "#F1F1F2";
          });
        })
  
        .on("mouseover", function(d){
  
          d3.select(this)
            .transition()
            .attr("fill", function(d) { return color(d.name); });
  
          d3.select("#line-" + d.name.replace(" ", "").replace("/", ""))
            .transition()
            .style("stroke-width", 2.5);  
        })
  
        .on("mouseout", function(d){
  
          d3.select(this)
            .transition()
            .attr("fill", function(d) {
            return d.visible ? color(d.name) : "#F1F1F2";});
  
          d3.select("#line-" + d.name.replace(" ", "").replace("/", ""))
            .transition()
            .style("stroke-width", 1.5);
        })
        
    issue.append("text")
        .attr("x", width1 + (margin.right/3)) 
        .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace); })  // (return (11.25/2 =) 5.625) + i * (5.625) 
        .text(function(d) { return d.name; }); 
  
    // Hover line 
    var hoverLineGroup = svg.append("g") 
              .attr("class", "hover-line");
  
    var hoverLine = hoverLineGroup // Create line with basic attributes
          .append("line")
              .attr("id", "hover-line")
              .attr("x1", 10).attr("x2", 10) 
              .attr("y1", 0).attr("y2", height1 + 10)
              .style("pointer-events", "none") // Stop line interferring with cursor
              .style("opacity", 1e-6); // Set opacity to zero 
  
    var hoverDate = hoverLineGroup
          .append('text')
              .attr("class", "hover-text")
              .attr("y", height1 - (height1-40)) // hover date text position
              .attr("x", width1 - 150) // hover date text position
              .style("fill", "#E6E7E8");
  
    var columnNames = d3.keys(data[0]) //grab the key values from your first data row
                                       //these are the same as your column names
                    .slice(1); //remove the first column name (`date`);
    var focus = issue.select("g") // create group elements to house tooltip text
        .data(columnNames) // bind each column name date to each g element
      .enter().append("g") //create one <g> for each columnName
        .attr("class", "focus"); 
  
    // focus.append("text") // http://stackoverflow.com/questions/22064083/d3-js-multi-series-chart-with-y-value-tracking
    //       .attr("class", "tooltip")
    //       .attr("x", width1 + 20) // position tooltips  
    //       .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace); }); // (return (11.25/2 =) 5.625) + i * (5.625) // position tooltips       
  
    // Add mouseover events for hover line.
    d3.select("#mouse-tracker") // select chart plot background rect #mouse-tracker
    .on("mousemove", mousemove) // on mousemove activate mousemove function defined below
    .on("mouseout", function() {
        hoverDate
            .text(null) // on mouseout remove text for hover date
  
        d3.select("#hover-line")
            .style("opacity", 1e-6); // On mouse out making line invisible
    });
  
    function mousemove() { 
        var mouse_x = d3.mouse(this)[0]; // Finding mouse x position on rect
        var graph_x = xScale.invert(mouse_x); // 
  
        var mouse_y = d3.mouse(this)[1]; // Finding mouse y position on rect
        var graph_y = yScale.invert(mouse_y);
        // console.log(graph_x);
        
        var format = d3.timeFormat('%b %Y'); // Format hover date text to show three letter month and full year
        
        hoverDate.text(format(graph_x)); // scale mouse position to xScale date and format it to show month and year
        
        d3.select("#hover-line") // select hover-line and changing attributes to mouse position
            .attr("x1", mouse_x) 
            .attr("x2", mouse_x)
            .style("opacity", 1); // Making line visible
  
        // Legend tooltips // http://www.d3noob.org/2014/07/my-favourite-tooltip-method-for-line.html
  
        var x0 = xScale.invert(d3.mouse(this)[0]), /* d3.mouse(this)[0] returns the x position on the screen of the mouse. xScale.invert function is reversing the process that we use to map the domain (date) to range (position on screen). So it takes the position on the screen and converts it into an equivalent date! */
        i = bisectDate(data, x0, 1), // use our bisectDate function that we declared earlier to find the index of our data array that is close to the mouse cursor
        /*It takes our data array and the date corresponding to the position of or mouse cursor and returns the index number of the data array which has a date that is higher than the cursor position.*/
        d0 = data[i - 1],
        d1 = data[i],
        /*d0 is the combination of date and rating that is in the data array at the index to the left of the cursor and d1 is the combination of date and close that is in the data array at the index to the right of the cursor. In other words we now have two variables that know the value and date above and below the date that corresponds to the position of the cursor.*/
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        /*The final line in this segment declares a new array d that is represents the date and close combination that is closest to the cursor. It is using the magic JavaScript short hand for an if statement that is essentially saying if the distance between the mouse cursor and the date and close combination on the left is greater than the distance between the mouse cursor and the date and close combination on the right then d is an array of the date and close on the right of the cursor (d1). Otherwise d is an array of the date and close on the left of the cursor (d0).*/
  
        //d is now the data row for the date closest to the mouse position
  
        focus.select("text").text(function(columnName){
           //because you didn't explictly set any data on the <text>
           //elements, each one inherits the data from the focus <g>
  
           return (d[columnName]);
        });
    }; 
    //for brusher of the slider bar at the bottom  
    function brushed() {
      var selection = d3.event.selection === null ? xScale2.domain() : d3.event.selection;
      xScale.domain(selection.map(xScale2.invert, xScale2));
      
      svg.select(".x.axis")   // replot xAxis with transition when brush used
          .transition()
          .call(xAxis);
  
      maxY = findMaxY(categories); // Find max Y rating value categories data with "visible"; true
      yScale.domain([0,(maxY + 50)]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true
      
      svg.select(".y.axis")    // Redraw yAxis
        .transition()
        .call(yAxis);   
  
      issue.select("path") // Redraw lines based on brush xAxis scale and domain
        .transition()
        .attr("d", function(d){
          return d.visible ? line(d.values) : null; // If d.visible is true then draw line for this d selection
        });
    }
     
}   
    
function findMaxY(data){  // Define function "findMaxY"
    var maxYValues = data.map(function(d) { 
      if (d.visible){
        return d3.max(d.values, function(value) { // Return max rating value
          if(typeof value.rating !== "number") {
            value.rating = 0;
          }
          return value.rating; 
        })
      }
    });
    return d3.max(maxYValues);
}
 
allPodsData = [];

function collectPods() {
  cleanHistoricalView();
  var pods, nodes, allPods = [];
  flag = false; // making flag false so that it can populate dateData again.
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (this.readyState === 4) {  
          if (this.status === 200) {
              var myArr = JSON.parse(this.responseText);
              pods = myArr.pods;
              nodes = myArr.nodes;
              // console.log(pods);
              // console.log(nodes);
              // Pods
              if(pods != null) {
                  for (var i = 0; i < pods.length; i++) {  
                    allPods.push(pods[i].PodInfo.metadata.name);
                  }
              }
              else if (nodes != null) {
                for (var i = 0; i < nodes.length; i++) {  
                  allPods.push(nodes[i].metadata.name);
                }
              } 

              if(allPods.length > 0) {
                allPods.forEach(item => {
                  if(pods != null) {
                    collectDataFromAllPods(item); 
                  }
                  else if (nodes != null) {
                    collectDataFromAllNodes(item); 
                  }
                });
                console.log("calling filter data");
                // console.log(dateData)
                setTimeout(()=> {
                  filterData(allPodsData) // will manipulate data of this array and making it something like (one date and all pods value at that instance of time)
                } , 2000)

              }
          }    
      }
    };
    // http://localhost:60000/api/scrape/kube-system?type=statefulsets,deployments,daemonsets&fieldSelector=&labelSelector=
    
    xmlhttp.open('POST', `https://localhost:60001/api/scrape/${namespace}?type=${type}&labelSelector&fieldSelector`, true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.setRequestHeader('ZBIO_CLUSTER_KEY', KEY);
    xmlhttp.send();
}

function collectDataFromAllPods(pod) {
  var t = new Date();
  t = parseInt(t.getTime().toString().slice(0,-3));
  time = subMinutes(new Date(), 60);
  time = parseInt(time.toString().slice(0,-3));
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      data = JSON.parse(this.responseText);
      if(data != null) {
        // console.log(data);
        data.forEach(item => {
            item.metrics.forEach(d => {
              if(item.tags.__name__ == "zbio_podcpu") {
                var storeData = {};
                storeData[pod] =  Math.round(d.value/100000)
                allPodsData.push({date: new Date(d.timestamp), storeData});

              }
            });
          });
        // console.log("------------end------------")
      }
    }};
    xmlhttp.open('POST', `https://localhost:60001/api/podmetrics/${namespace}?pod=${pod}&collection=podcpu&start=${time}&end=${t}`, true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.setRequestHeader('ZBIO_CLUSTER_KEY', KEY);
    xmlhttp.send();
}

function collectDataFromAllNodes(node) {
  var t = new Date();
  t = parseInt(t.getTime().toString().slice(0,-3));
  time = subMinutes(new Date(), 60);
  time = parseInt(time.toString().slice(0,-3));
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      data = JSON.parse(this.responseText);
      if(data != null) {
        console.log(data);
        data.forEach(item => {
            item.metrics.forEach(d => {
              if(item.tags.__name__ == "zbio_nodecpu") {
                var storeData = {};
                storeData[node] =  Math.round(d.value/100000)
                allPodsData.push({date: new Date(d.timestamp), storeData});

              }
            });
          });
        // console.log("------------end------------")
      }
    }};
    xmlhttp.open('POST', `https://localhost:60001/api/nodemetrics?nodes=${node}&start=${time}&end=${t}`, true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.setRequestHeader('ZBIO_CLUSTER_KEY', KEY);
    xmlhttp.send();
}

function subMinutes(date, minutes) {
  return date.getTime() - minutes*60000;
}

function filterData(podsData) { 
  var AllPods = d3.nest()
  .key(function(d) { return d.date; })
  .entries(podsData);

  console.log(AllPods)

  var tempObj = [];
  var newArr = [];

  AllPods.forEach(item => {
    val = item.values;
    // console.log(val)
    tempObj = {};
    val.forEach(element => {
      Key = Object.keys(element);
      Key1 = Object.keys(element[Key[1]]);
      // console.log(element[Key[1]][Key1]);
      tempObj[Key1] = element[Key[1]][Key1]
    });
    // console.log(item.key)
    tempObj["date"] = new Date(item.key);
    newArr.push(tempObj)
  });

  // console.log(newArr)
  draw(newArr);
}

function cleanHistoricalView() {
  d3.select("body").select("#chart1").selectAll("svg").remove(); // cleaning historical svg
  allPodsData = []; // empty the previou pods data; as it is global array. 
  margin = {top: 20, right: 200, bottom: 100, left: 50},
  margin2 = { top: 430, right: 10, bottom: 20, left: 40 },
  width1 = 960 - margin.left - margin.right,
  height1 = 500 - margin.top - margin.bottom,
  height2 = 500 - margin2.top - margin2.bottom;

parseDate = d3.timeFormat("%Y%m%d").parse;
bisectDate = d3.bisector(function(d) { return d.date; }).left;

xScale = d3.scaleTime()
    .range([0, width1]),

    xScale2 = d3.scaleTime()
    .range([0, width1]); // Duplicate xScale for brushing ref later

yScale = d3.scaleLinear()
    .range([height1, 0]);

// 40 Custom DDV colors

color =  d3.scaleOrdinal().range(["#48A36D", "Blue", "Red", "Green", "Brown","#80CCB3", "#7FC9BD", "#56AE7C",  "#64B98C", "Purple", "Gray", "Orange", "Maroon", "Aquamarine", "Coral", "Fuchsia", "Wheat", "Lime", "Crimson", "Khaki", "Hot pink", "Magenta", "Olden", "Plum", "Olive", "Cyan", "#8897CE", "#8F90CD", "#9788CD", "#9E81CC", "#7EC4CF", "#7FBBCF", "#7FB1CF", "#80A8CE", "#AA81C5", "#B681BE", "#C280B7", "#CE80B0", "#D3779F", "#D76D8F", "#DC647E", "#E05A6D", "#E16167"]);
xAxis = d3.axisBottom()
    .scale(xScale);

    xAxis2 = d3.axisBottom() // xAxis for brush slider
    .scale(xScale2);

yAxis = d3.axisLeft()
    .scale(yScale); 

line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { 
      if(typeof d.rating !== "number"){
        d.rating = 0;
      }
      return yScale(d.rating); 
    })
    .defined(function(d) { 
      if(typeof d.rating !== "number"){
        d.rating = 0;
      }
      return d.rating; 
    });  // Hiding line value defaults of 0 for missing data

maxY; // Defined later to update yAxis

svg = d3.select("body").select("#chart1").append("svg")
    .attr("width", width1 + margin.left + margin.right)
    .attr("height", height1 + margin.top + margin.bottom) //height + margin.top + margin.bottom
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Create invisible rect for mouse tracking
svg.append("rect")
    .attr("width", width1)
    .attr("height", height1)                                    
    .attr("x", 0) 
    .attr("y", 0)
    .attr("id", "mouse-tracker")
    .style("fill", "white"); 

//for slider part-----------------------------------------------------------------------------------
  
context = svg.append("g") // Brushing context box container
    .attr("transform", "translate(" + 0 + "," + 410 + ")")
    .attr("class", "context");

// append clip path for lines plotted, hiding those part out of bounds
svg.append("defs")
  .append("clipPath") 
    .attr("id", "clip")
    .append("rect")
    .attr("width", width1)
    .attr("height", height1); 
}

collectPods();
getKey();