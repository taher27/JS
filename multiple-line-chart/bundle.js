(function (d3) {
  'use strict';

  const colorLegend = (selection, props) => {
    const {
      colorScale,
      circleRadius,
      spacing,
      textOffset
    } = props;

    const groups = selection.selectAll('g')
      .data(colorScale.domain());
    const groupsEnter = groups
      .enter().append('g')
        .attr('class', 'tick');
    groupsEnter
      .merge(groups)
        .attr('transform', (d, i) =>
          `translate(0, ${i * spacing})`
        );
    groups.exit().remove();

    groupsEnter.append('circle')
      .merge(groups.select('circle'))
        .attr('r', circleRadius)
        .attr('fill', colorScale);

    groupsEnter.append('text')
      .merge(groups.select('text'))
        .text(d => d)
        .attr('dy', '0.32em')
        .attr('x', textOffset);
  };

  const svg = d3.select('svg');

  const width = +svg.attr('width');
  const height = +svg.attr('height');

  const render = data => {
    const title = 'A Week of Temperature Around the World';
    
    const xValue = d => d.timestamp;
    const xAxisLabel = 'Time';
    
    const yValue = d => d.temperature;
    const yAxisLabel = 'Temperature';
    
    const colorValue = d => d.city;
    
    const margin = { top: 60, right: 160, bottom: 88, left: 105 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, xValue))
      .range([0, innerWidth])
      .nice();
    
    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, yValue))
      .range([innerHeight, 0])
      .nice();
    
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const xAxis = d3.axisBottom(xScale)
      .tickSize(-innerHeight)
      .tickPadding(15);
    
    const yAxis = d3.axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickPadding(10);
    
    const yAxisG = g.append('g').call(yAxis);
    yAxisG.selectAll('.domain').remove();
    
    yAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', -60)
        .attr('x', -innerHeight / 2)
        .attr('fill', 'black')
        .attr('transform', `rotate(-90)`)
        .attr('text-anchor', 'middle')
        .text(yAxisLabel);
    
    const xAxisG = g.append('g').call(xAxis)
      .attr('transform', `translate(0,${innerHeight})`);
    
    xAxisG.select('.domain').remove();
    
    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', 80)
        .attr('x', innerWidth / 2)
        .attr('fill', 'black')
        .text(xAxisLabel);
    
    const lineGenerator = d3.line()
      .x(d => xScale(xValue(d)))
      .y(d => yScale(yValue(d)))
      .curve(d3.curveBasis);
    
    const lastYValue = d =>
      yValue(d.values[d.values.length - 1]);
    
    const nested = d3.nest()
      .key(function(d) { return d.pod; })
      .entries(data)
      .sort((a, b) =>
        d3.descending(lastYValue(a), lastYValue(b))
      );
    
// var nested_data = d3.nest()
//     .key(function(d) { return d.tags.pod; })
//     .entries(data);

    console.log(nested);
    
    colorScale.domain(nested.map(d => d.key));
    
    
    g.selectAll('.line-path').data(nested)
      .enter().append('path')
        .attr('class', 'line-path')
        .attr('d', d => {
            // console.log(d.values[0].metrics[0].value)
            lineGenerator(d.values[0].metrics)
        })
        .attr('stroke', d => colorScale(d.key));
    
    g.append('text')
        .attr('class', 'title')
        .attr('y', -10)
        .text(title);
    
    svg.append('g')
      .attr('transform', `translate(790,121)`)
      .call(colorLegend, {
        colorScale,
        circleRadius: 13,
        spacing: 30,
        textOffset: 15
      });
  };

  var data = [
    {
        "pod": "zbio-broker-group1-1",
        "metrics": [
            {
                "timestamp": 1589599920000,
                "value": 305027
            },
            {
                "timestamp": 1589600040000,
                "value": 305027
            },
            {
                "timestamp": 1589600160000,
                "value": 2480
            },
            {
                "timestamp": 1589600280000,
                "value": 2480
            },
            {
                "timestamp": 1589600400000,
                "value": 2480
            },
            {
                "timestamp": 1589600640000,
                "value": 2812
            },
            {
                "timestamp": 1589600760000,
                "value": 2812
            },
            {
                "timestamp": 1589600880000,
                "value": 2812
            },
            {
                "timestamp": 1589601000000,
                "value": 8322
            },
            {
                "timestamp": 1589601120000,
                "value": 8322
            },
            {
                "timestamp": 1589601240000,
                "value": 3566
            },
            {
                "timestamp": 1589601360000,
                "value": 3566
            },
            {
                "timestamp": 1589601480000,
                "value": 3566
            },
            {
                "timestamp": 1589601600000,
                "value": 74070
            },
            {
                "timestamp": 1589601720000,
                "value": 74070
            },
            {
                "timestamp": 1589601840000,
                "value": 3822
            },
            {
                "timestamp": 1589601960000,
                "value": 3822
            },
            {
                "timestamp": 1589602080000,
                "value": 3822
            },
            {
                "timestamp": 1589602200000,
                "value": 24593
            },
            {
                "timestamp": 1589602320000,
                "value": 24593
            },
            {
                "timestamp": 1589602440000,
                "value": 0
            },
            {
                "timestamp": 1589602560000,
                "value": 0
            },
            {
                "timestamp": 1589602680000,
                "value": 0
            },
            {
                "timestamp": 1589602800000,
                "value": 15917
            },
            {
                "timestamp": 1589602920000,
                "value": 15917
            },
            {
                "timestamp": 1589603040000,
                "value": 0
            },
            {
                "timestamp": 1589603160000,
                "value": 0
            },
            {
                "timestamp": 1589603280000,
                "value": 0
            },
            {
                "timestamp": 1589603880000,
                "value": 0
            },
            {
                "timestamp": 1589604000000,
                "value": 0
            },
            {
                "timestamp": 1589604120000,
                "value": 0
            },
            {
                "timestamp": 1589605080000,
                "value": 14136
            },
            {
                "timestamp": 1589605200000,
                "value": 14136
            },
            {
                "timestamp": 1589605320000,
                "value": 117691
            },
            {
                "timestamp": 1589605440000,
                "value": 117691
            },
            {
                "timestamp": 1589605560000,
                "value": 117691
            },
            {
                "timestamp": 1589605680000,
                "value": 4487
            },
            {
                "timestamp": 1589605800000,
                "value": 4487
            },
            {
                "timestamp": 1589605920000,
                "value": 14855
            },
            {
                "timestamp": 1589606040000,
                "value": 14855
            },
            {
                "timestamp": 1589606160000,
                "value": 14855
            },
            {
                "timestamp": 1589606520000,
                "value": 4397
            },
            {
                "timestamp": 1589606640000,
                "value": 4397
            },
            {
                "timestamp": 1589607120000,
                "value": 0
            },
            {
                "timestamp": 1589607240000,
                "value": 0
            },
            {
                "timestamp": 1589607360000,
                "value": 0
            },
            {
                "timestamp": 1589607480000,
                "value": 0
            },
            {
                "timestamp": 1589607600000,
                "value": 0
            },
            {
                "timestamp": 1589607960000,
                "value": 0
            },
            {
                "timestamp": 1589608080000,
                "value": 0
            },
            {
                "timestamp": 1589608200000,
                "value": 0
            },
            {
                "timestamp": 1589608320000,
                "value": 0
            },
            {
                "timestamp": 1589608440000,
                "value": 0
            },
            {
                "timestamp": 1589608560000,
                "value": 0
            },
            {
                "timestamp": 1589608680000,
                "value": 0
            },
            {
                "timestamp": 1589608800000,
                "value": 0
            },
            {
                "timestamp": 1589608920000,
                "value": 0
            },
            {
                "timestamp": 1589609040000,
                "value": 0
            },
            {
                "timestamp": 1589609160000,
                "value": 0
            },
            {
                "timestamp": 1589609280000,
                "value": 0
            },
            {
                "timestamp": 1589609400000,
                "value": 0
            },
            {
                "timestamp": 1589609520000,
                "value": 0
            },
            {
                "timestamp": 1589609640000,
                "value": 0
            },
            {
                "timestamp": 1589609760000,
                "value": 0
            },
            {
                "timestamp": 1589609880000,
                "value": 0
            },
            {
                "timestamp": 1589610000000,
                "value": 0
            },
            {
                "timestamp": 1589610120000,
                "value": 0
            },
            {
                "timestamp": 1589610240000,
                "value": 0
            },
            {
                "timestamp": 1589610360000,
                "value": 0
            },
            {
                "timestamp": 1589610480000,
                "value": 0
            },
            {
                "timestamp": 1589610600000,
                "value": 0
            },
            {
                "timestamp": 1589610720000,
                "value": 0
            },
            {
                "timestamp": 1589610840000,
                "value": 0
            },
            {
                "timestamp": 1589610960000,
                "value": 0
            },
            {
                "timestamp": 1589611080000,
                "value": 0
            },
            {
                "timestamp": 1589611200000,
                "value": 0
            },
            {
                "timestamp": 1589611320000,
                "value": 0
            },
            {
                "timestamp": 1589611440000,
                "value": 0
            },
            {
                "timestamp": 1589611560000,
                "value": 0
            },
            {
                "timestamp": 1589611680000,
                "value": 0
            },
            {
                "timestamp": 1589611800000,
                "value": 0
            },
            {
                "timestamp": 1589611920000,
                "value": 0
            },
            {
                "timestamp": 1589612040000,
                "value": 0
            },
            {
                "timestamp": 1589612160000,
                "value": 0
            },
            {
                "timestamp": 1589612280000,
                "value": 0
            },
            {
                "timestamp": 1589612400000,
                "value": 0
            },
            {
                "timestamp": 1589612520000,
                "value": 0
            },
            {
                "timestamp": 1589612640000,
                "value": 0
            },
            {
                "timestamp": 1589613120000,
                "value": 2619
            },
            {
                "timestamp": 1589613240000,
                "value": 2619
            },
            {
                "timestamp": 1589653080000,
                "value": 2553
            },
            {
                "timestamp": 1589653200000,
                "value": 2553
            },
            {
                "timestamp": 1589653320000,
                "value": 13742
            },
            {
                "timestamp": 1589653440000,
                "value": 13742
            },
            {
                "timestamp": 1589653560000,
                "value": 13742
            },
            {
                "timestamp": 1589653680000,
                "value": 2520
            },
            {
                "timestamp": 1589653800000,
                "value": 2520
            },
            {
                "timestamp": 1589653920000,
                "value": 2520
            },
            {
                "timestamp": 1589705760000,
                "value": 0
            },
            {
                "timestamp": 1589705880000,
                "value": 0
            },
            {
                "timestamp": 1589706000000,
                "value": 0
            },
            {
                "timestamp": 1589706120000,
                "value": 0
            },
            {
                "timestamp": 1589706240000,
                "value": 0
            },
            {
                "timestamp": 1589706360000,
                "value": 8836
            },
            {
                "timestamp": 1589706480000,
                "value": 8836
            },
            {
                "timestamp": 1589706600000,
                "value": 26562
            },
            {
                "timestamp": 1589706720000,
                "value": 26562
            },
            {
                "timestamp": 1589706840000,
                "value": 26562
            },
            {
                "timestamp": 1589706960000,
                "value": 3834
            },
            {
                "timestamp": 1589707080000,
                "value": 3834
            },
            {
                "timestamp": 1589707200000,
                "value": 83909
            },
            {
                "timestamp": 1589707320000,
                "value": 83909
            },
            {
                "timestamp": 1589707440000,
                "value": 83909
            },
            {
                "timestamp": 1589707560000,
                "value": 7963
            },
            {
                "timestamp": 1589707680000,
                "value": 7963
            },
            {
                "timestamp": 1589707800000,
                "value": 9111
            },
            {
                "timestamp": 1589707920000,
                "value": 9111
            },
            {
                "timestamp": 1589708040000,
                "value": 9111
            },
            {
                "timestamp": 1589708160000,
                "value": 8464
            },
            {
                "timestamp": 1589708280000,
                "value": 8464
            },
            {
                "timestamp": 1589781360000,
                "value": 0
            },
            {
                "timestamp": 1589781480000,
                "value": 0
            },
            {
                "timestamp": 1589781600000,
                "value": 0
            },
            {
                "timestamp": 1589781720000,
                "value": 17101
            },
            {
                "timestamp": 1589781840000,
                "value": 17101
            },
            {
                "timestamp": 1589781960000,
                "value": 7178
            },
            {
                "timestamp": 1589782080000,
                "value": 7178
            },
            {
                "timestamp": 1589782200000,
                "value": 7178
            },
            {
                "timestamp": 1589782320000,
                "value": 39974
            },
            {
                "timestamp": 1589782440000,
                "value": 39974
            },
            {
                "timestamp": 1589782560000,
                "value": 9083
            },
            {
                "timestamp": 1589782680000,
                "value": 9083
            },
            {
                "timestamp": 1589782800000,
                "value": 9083
            },
            {
                "timestamp": 1589782920000,
                "value": 18854
            },
            {
                "timestamp": 1589783040000,
                "value": 18854
            },
            {
                "timestamp": 1589783160000,
                "value": 3950
            },
            {
                "timestamp": 1589783280000,
                "value": 3950
            },
            {
                "timestamp": 1589783400000,
                "value": 3950
            },
            {
                "timestamp": 1589783520000,
                "value": 60156
            },
            {
                "timestamp": 1589783640000,
                "value": 60156
            },
            {
                "timestamp": 1589783760000,
                "value": 0
            },
            {
                "timestamp": 1589783880000,
                "value": 0
            },
            {
                "timestamp": 1589784000000,
                "value": 0
            },
            {
                "timestamp": 1589784120000,
                "value": 98750
            },
            {
                "timestamp": 1589784240000,
                "value": 98750
            },
            {
                "timestamp": 1589784360000,
                "value": 0
            },
            {
                "timestamp": 1589784480000,
                "value": 0
            },
            {
                "timestamp": 1589784600000,
                "value": 0
            },
            {
                "timestamp": 1589784720000,
                "value": 7495
            },
            {
                "timestamp": 1589784840000,
                "value": 7495
            },
            {
                "timestamp": 1589784960000,
                "value": 5542
            },
            {
                "timestamp": 1589785080000,
                "value": 5542
            },
            {
                "timestamp": 1589785200000,
                "value": 5542
            },
            {
                "timestamp": 1589785320000,
                "value": 32767
            },
            {
                "timestamp": 1589785440000,
                "value": 32767
            },
            {
                "timestamp": 1589785560000,
                "value": 7286
            },
            {
                "timestamp": 1589785680000,
                "value": 7286
            },
            {
                "timestamp": 1589785800000,
                "value": 7286
            },
            {
                "timestamp": 1589785920000,
                "value": 12984
            },
            {
                "timestamp": 1589786040000,
                "value": 12984
            },
            {
                "timestamp": 1589786160000,
                "value": 2631
            },
            {
                "timestamp": 1589786280000,
                "value": 2631
            },
            {
                "timestamp": 1589786400000,
                "value": 2631
            },
            {
                "timestamp": 1589786520000,
                "value": 12898
            },
            {
                "timestamp": 1589786640000,
                "value": 12898
            },
            {
                "timestamp": 1589786760000,
                "value": 0
            },
            {
                "timestamp": 1589786880000,
                "value": 0
            },
            {
                "timestamp": 1589787000000,
                "value": 0
            },
            {
                "timestamp": 1589787120000,
                "value": 18164
            },
            {
                "timestamp": 1589787240000,
                "value": 18164
            },
            {
                "timestamp": 1589787360000,
                "value": 2771
            },
            {
                "timestamp": 1589787480000,
                "value": 2771
            },
            {
                "timestamp": 1589787600000,
                "value": 2771
            },
            {
                "timestamp": 1589787720000,
                "value": 14792
            },
            {
                "timestamp": 1589787840000,
                "value": 14792
            },
            {
                "timestamp": 1589787960000,
                "value": 7130
            },
            {
                "timestamp": 1589788080000,
                "value": 7130
            },
            {
                "timestamp": 1589788200000,
                "value": 7130
            },
            {
                "timestamp": 1589788320000,
                "value": 105823
            },
            {
                "timestamp": 1589788440000,
                "value": 105823
            },
            {
                "timestamp": 1589788560000,
                "value": 0
            },
            {
                "timestamp": 1589788680000,
                "value": 0
            },
            {
                "timestamp": 1589788800000,
                "value": 0
            },
            {
                "timestamp": 1589788920000,
                "value": 32092
            },
            {
                "timestamp": 1589789040000,
                "value": 32092
            },
            {
                "timestamp": 1589789160000,
                "value": 0
            },
            {
                "timestamp": 1589789280000,
                "value": 0
            },
            {
                "timestamp": 1589789400000,
                "value": 0
            },
            {
                "timestamp": 1589789520000,
                "value": 15252
            },
            {
                "timestamp": 1589789640000,
                "value": 15252
            },
            {
                "timestamp": 1589789760000,
                "value": 7488
            },
            {
                "timestamp": 1589789880000,
                "value": 7488
            },
            {
                "timestamp": 1589790000000,
                "value": 7488
            },
            {
                "timestamp": 1589790120000,
                "value": 31902
            },
            {
                "timestamp": 1589790240000,
                "value": 31902
            },
            {
                "timestamp": 1589790360000,
                "value": 0
            },
            {
                "timestamp": 1589790480000,
                "value": 0
            },
            {
                "timestamp": 1589790600000,
                "value": 0
            },
            {
                "timestamp": 1589790720000,
                "value": 93369
            },
            {
                "timestamp": 1589790840000,
                "value": 93369
            },
            {
                "timestamp": 1589790960000,
                "value": 0
            },
            {
                "timestamp": 1589791080000,
                "value": 0
            },
            {
                "timestamp": 1589791200000,
                "value": 0
            },
            {
                "timestamp": 1589791320000,
                "value": 23921
            },
            {
                "timestamp": 1589791440000,
                "value": 23921
            },
            {
                "timestamp": 1589791560000,
                "value": 4610
            },
            {
                "timestamp": 1589791680000,
                "value": 4610
            },
            {
                "timestamp": 1589791800000,
                "value": 4610
            },
            {
                "timestamp": 1589791920000,
                "value": 47816
            },
            {
                "timestamp": 1589792040000,
                "value": 47816
            },
            {
                "timestamp": 1589792160000,
                "value": 7735
            },
            {
                "timestamp": 1589792280000,
                "value": 7735
            },
            {
                "timestamp": 1589792400000,
                "value": 7735
            },
            {
                "timestamp": 1589792520000,
                "value": 47674
            },
            {
                "timestamp": 1589792640000,
                "value": 47674
            },
            {
                "timestamp": 1589792760000,
                "value": 5617
            },
            {
                "timestamp": 1589792880000,
                "value": 5617
            },
            {
                "timestamp": 1589793000000,
                "value": 5617
            },
            {
                "timestamp": 1589793120000,
                "value": 8679
            },
            {
                "timestamp": 1589793240000,
                "value": 8679
            },
            {
                "timestamp": 1589793360000,
                "value": 8636
            },
            {
                "timestamp": 1589793480000,
                "value": 8636
            },
            {
                "timestamp": 1589793600000,
                "value": 8636
            },
            {
                "timestamp": 1589793720000,
                "value": 8857
            },
            {
                "timestamp": 1589793840000,
                "value": 8857
            },
            {
                "timestamp": 1589793960000,
                "value": 0
            },
            {
                "timestamp": 1589794080000,
                "value": 0
            },
            {
                "timestamp": 1589794200000,
                "value": 0
            },
            {
                "timestamp": 1589794320000,
                "value": 26484
            },
            {
                "timestamp": 1589794440000,
                "value": 26484
            },
            {
                "timestamp": 1589794560000,
                "value": 0
            },
            {
                "timestamp": 1589794680000,
                "value": 0
            },
            {
                "timestamp": 1589794800000,
                "value": 0
            },
            {
                "timestamp": 1589794920000,
                "value": 48583
            },
            {
                "timestamp": 1589795040000,
                "value": 48583
            },
            {
                "timestamp": 1589795160000,
                "value": 11910
            },
            {
                "timestamp": 1589795280000,
                "value": 11910
            },
            {
                "timestamp": 1589795400000,
                "value": 11910
            },
            {
                "timestamp": 1589795520000,
                "value": 113094
            },
            {
                "timestamp": 1589795640000,
                "value": 113094
            },
            {
                "timestamp": 1589795760000,
                "value": 6767
            },
            {
                "timestamp": 1589795880000,
                "value": 6767
            },
            {
                "timestamp": 1589796000000,
                "value": 6767
            },
            {
                "timestamp": 1589796120000,
                "value": 124816
            },
            {
                "timestamp": 1589796240000,
                "value": 124816
            },
            {
                "timestamp": 1589796360000,
                "value": 0
            },
            {
                "timestamp": 1589796480000,
                "value": 0
            },
            {
                "timestamp": 1589796600000,
                "value": 0
            },
            {
                "timestamp": 1589796720000,
                "value": 57681
            },
            {
                "timestamp": 1589796840000,
                "value": 57681
            },
            {
                "timestamp": 1589796960000,
                "value": 0
            },
            {
                "timestamp": 1589797080000,
                "value": 0
            },
            {
                "timestamp": 1589797200000,
                "value": 0
            },
            {
                "timestamp": 1589797320000,
                "value": 80948
            },
            {
                "timestamp": 1589797440000,
                "value": 80948
            },
            {
                "timestamp": 1589797560000,
                "value": 0
            },
            {
                "timestamp": 1589797680000,
                "value": 0
            },
            {
                "timestamp": 1589797800000,
                "value": 0
            },
            {
                "timestamp": 1589797920000,
                "value": 26387
            },
            {
                "timestamp": 1589798040000,
                "value": 26387
            },
            {
                "timestamp": 1589798160000,
                "value": 0
            },
            {
                "timestamp": 1589798280000,
                "value": 0
            },
            {
                "timestamp": 1589798400000,
                "value": 0
            },
            {
                "timestamp": 1589798520000,
                "value": 26068
            },
            {
                "timestamp": 1589798640000,
                "value": 26068
            },
            {
                "timestamp": 1589798760000,
                "value": 0
            },
            {
                "timestamp": 1589798880000,
                "value": 0
            },
            {
                "timestamp": 1589799000000,
                "value": 0
            },
            {
                "timestamp": 1589799120000,
                "value": 96607
            },
            {
                "timestamp": 1589799240000,
                "value": 96607
            },
            {
                "timestamp": 1589799360000,
                "value": 1979
            },
            {
                "timestamp": 1589799480000,
                "value": 1979
            },
            {
                "timestamp": 1589799600000,
                "value": 1979
            },
            {
                "timestamp": 1589799720000,
                "value": 19978
            },
            {
                "timestamp": 1589799840000,
                "value": 19978
            },
            {
                "timestamp": 1589799960000,
                "value": 5057
            },
            {
                "timestamp": 1589800080000,
                "value": 5057
            },
            {
                "timestamp": 1589800200000,
                "value": 5057
            },
            {
                "timestamp": 1589800320000,
                "value": 18425
            },
            {
                "timestamp": 1589800440000,
                "value": 18425
            },
            {
                "timestamp": 1589800560000,
                "value": 5247
            },
            {
                "timestamp": 1589800680000,
                "value": 5247
            },
            {
                "timestamp": 1589800800000,
                "value": 5247
            },
            {
                "timestamp": 1589800920000,
                "value": 39670
            },
            {
                "timestamp": 1589801040000,
                "value": 39670
            },
            {
                "timestamp": 1589801160000,
                "value": 6684
            },
            {
                "timestamp": 1589801280000,
                "value": 6684
            },
            {
                "timestamp": 1589801400000,
                "value": 6684
            },
            {
                "timestamp": 1589801520000,
                "value": 5328
            },
            {
                "timestamp": 1589801640000,
                "value": 5328
            },
            {
                "timestamp": 1589801760000,
                "value": 7155
            },
            {
                "timestamp": 1589801880000,
                "value": 7155
            },
            {
                "timestamp": 1589802000000,
                "value": 7155
            },
            {
                "timestamp": 1589802120000,
                "value": 5653
            },
            {
                "timestamp": 1589802240000,
                "value": 5653
            },
            {
                "timestamp": 1589802360000,
                "value": 0
            },
            {
                "timestamp": 1589802480000,
                "value": 0
            },
            {
                "timestamp": 1589802600000,
                "value": 0
            },
            {
                "timestamp": 1589802720000,
                "value": 82627
            },
            {
                "timestamp": 1589802840000,
                "value": 82627
            },
            {
                "timestamp": 1589802960000,
                "value": 6058
            },
            {
                "timestamp": 1589803080000,
                "value": 6058
            },
            {
                "timestamp": 1589803200000,
                "value": 6058
            },
            {
                "timestamp": 1589803320000,
                "value": 52149
            },
            {
                "timestamp": 1589803440000,
                "value": 52149
            },
            {
                "timestamp": 1589803560000,
                "value": 52149
            },
            {
                "timestamp": 1589805000000,
                "value": 1719
            },
            {
                "timestamp": 1589805120000,
                "value": 1719
            },
            {
                "timestamp": 1589805240000,
                "value": 0
            },
            {
                "timestamp": 1589805360000,
                "value": 0
            },
            {
                "timestamp": 1589805480000,
                "value": 0
            },
            {
                "timestamp": 1589805600000,
                "value": 4536
            },
            {
                "timestamp": 1589805720000,
                "value": 4536
            },
            {
                "timestamp": 1589805840000,
                "value": 4536
            }
        ]
    },
    {
        "pod": "zbio-broker-group1-2",
        "metrics": [
            {
                "timestamp": 1589599920000,
                "value": 305027
            },
            {
                "timestamp": 1589600040000,
                "value": 305027
            },
            {
                "timestamp": 1589600160000,
                "value": 2480
            },
            {
                "timestamp": 1589600280000,
                "value": 2480
            },
            {
                "timestamp": 1589600400000,
                "value": 2480
            },
            {
                "timestamp": 1589600640000,
                "value": 2812
            },
            {
                "timestamp": 1589600760000,
                "value": 2812
            },
            {
                "timestamp": 1589600880000,
                "value": 2812
            },
            {
                "timestamp": 1589601000000,
                "value": 8322
            },
            {
                "timestamp": 1589601120000,
                "value": 8322
            },
            {
                "timestamp": 1589601240000,
                "value": 3566
            },
            {
                "timestamp": 1589601360000,
                "value": 3566
            },
            {
                "timestamp": 1589601480000,
                "value": 3566
            },
            {
                "timestamp": 1589601600000,
                "value": 74070
            },
            {
                "timestamp": 1589601720000,
                "value": 74070
            },
            {
                "timestamp": 1589601840000,
                "value": 3822
            },
            {
                "timestamp": 1589601960000,
                "value": 3822
            },
            {
                "timestamp": 1589602080000,
                "value": 3822
            },
            {
                "timestamp": 1589602200000,
                "value": 24593
            },
            {
                "timestamp": 1589602320000,
                "value": 24593
            },
            {
                "timestamp": 1589602440000,
                "value": 0
            },
            {
                "timestamp": 1589602560000,
                "value": 0
            },
            {
                "timestamp": 1589602680000,
                "value": 0
            },
            {
                "timestamp": 1589602800000,
                "value": 15917
            },
            {
                "timestamp": 1589602920000,
                "value": 15917
            },
            {
                "timestamp": 1589603040000,
                "value": 0
            },
            {
                "timestamp": 1589603160000,
                "value": 0
            },
            {
                "timestamp": 1589603280000,
                "value": 0
            },
            {
                "timestamp": 1589603880000,
                "value": 0
            },
            {
                "timestamp": 1589604000000,
                "value": 0
            },
            {
                "timestamp": 1589604120000,
                "value": 0
            },
            {
                "timestamp": 1589605080000,
                "value": 14136
            },
            {
                "timestamp": 1589605200000,
                "value": 14136
            },
            {
                "timestamp": 1589605320000,
                "value": 117691
            },
            {
                "timestamp": 1589605440000,
                "value": 117691
            },
            {
                "timestamp": 1589605560000,
                "value": 117691
            },
            {
                "timestamp": 1589605680000,
                "value": 4487
            },
            {
                "timestamp": 1589605800000,
                "value": 4487
            },
            {
                "timestamp": 1589605920000,
                "value": 14855
            },
            {
                "timestamp": 1589606040000,
                "value": 14855
            },
            {
                "timestamp": 1589606160000,
                "value": 14855
            },
            {
                "timestamp": 1589606520000,
                "value": 4397
            },
            {
                "timestamp": 1589606640000,
                "value": 4397
            },
            {
                "timestamp": 1589607120000,
                "value": 0
            },
            {
                "timestamp": 1589607240000,
                "value": 0
            },
            {
                "timestamp": 1589607360000,
                "value": 0
            },
            {
                "timestamp": 1589607480000,
                "value": 0
            },
            {
                "timestamp": 1589607600000,
                "value": 0
            },
            {
                "timestamp": 1589607960000,
                "value": 0
            },
            {
                "timestamp": 1589608080000,
                "value": 0
            },
            {
                "timestamp": 1589608200000,
                "value": 0
            },
            {
                "timestamp": 1589608320000,
                "value": 0
            },
            {
                "timestamp": 1589608440000,
                "value": 0
            },
            {
                "timestamp": 1589608560000,
                "value": 0
            },
            {
                "timestamp": 1589608680000,
                "value": 0
            },
            {
                "timestamp": 1589608800000,
                "value": 0
            },
            {
                "timestamp": 1589608920000,
                "value": 0
            },
            {
                "timestamp": 1589609040000,
                "value": 0
            },
            {
                "timestamp": 1589609160000,
                "value": 0
            },
            {
                "timestamp": 1589609280000,
                "value": 0
            },
            {
                "timestamp": 1589609400000,
                "value": 0
            },
            {
                "timestamp": 1589609520000,
                "value": 0
            },
            {
                "timestamp": 1589609640000,
                "value": 0
            },
            {
                "timestamp": 1589609760000,
                "value": 0
            },
            {
                "timestamp": 1589609880000,
                "value": 0
            },
            {
                "timestamp": 1589610000000,
                "value": 0
            },
            {
                "timestamp": 1589610120000,
                "value": 0
            },
            {
                "timestamp": 1589610240000,
                "value": 0
            },
            {
                "timestamp": 1589610360000,
                "value": 0
            },
            {
                "timestamp": 1589610480000,
                "value": 0
            },
            {
                "timestamp": 1589610600000,
                "value": 0
            },
            {
                "timestamp": 1589610720000,
                "value": 0
            },
            {
                "timestamp": 1589610840000,
                "value": 0
            },
            {
                "timestamp": 1589610960000,
                "value": 0
            },
            {
                "timestamp": 1589611080000,
                "value": 0
            },
            {
                "timestamp": 1589611200000,
                "value": 0
            },
            {
                "timestamp": 1589611320000,
                "value": 0
            },
            {
                "timestamp": 1589611440000,
                "value": 0
            },
            {
                "timestamp": 1589611560000,
                "value": 0
            },
            {
                "timestamp": 1589611680000,
                "value": 0
            },
            {
                "timestamp": 1589611800000,
                "value": 0
            },
            {
                "timestamp": 1589611920000,
                "value": 0
            },
            {
                "timestamp": 1589612040000,
                "value": 0
            },
            {
                "timestamp": 1589612160000,
                "value": 0
            },
            {
                "timestamp": 1589612280000,
                "value": 0
            },
            {
                "timestamp": 1589612400000,
                "value": 0
            },
            {
                "timestamp": 1589612520000,
                "value": 0
            },
            {
                "timestamp": 1589612640000,
                "value": 0
            },
            {
                "timestamp": 1589613120000,
                "value": 2619
            },
            {
                "timestamp": 1589613240000,
                "value": 2619
            },
            {
                "timestamp": 1589653080000,
                "value": 2553
            },
            {
                "timestamp": 1589653200000,
                "value": 2553
            },
            {
                "timestamp": 1589653320000,
                "value": 13742
            },
            {
                "timestamp": 1589653440000,
                "value": 13742
            },
            {
                "timestamp": 1589653560000,
                "value": 13742
            },
            {
                "timestamp": 1589653680000,
                "value": 2520
            },
            {
                "timestamp": 1589653800000,
                "value": 2520
            },
            {
                "timestamp": 1589653920000,
                "value": 2520
            },
            {
                "timestamp": 1589705760000,
                "value": 0
            },
            {
                "timestamp": 1589705880000,
                "value": 0
            },
            {
                "timestamp": 1589706000000,
                "value": 0
            },
            {
                "timestamp": 1589706120000,
                "value": 0
            },
            {
                "timestamp": 1589706240000,
                "value": 0
            },
            {
                "timestamp": 1589706360000,
                "value": 8836
            },
            {
                "timestamp": 1589706480000,
                "value": 8836
            },
            {
                "timestamp": 1589706600000,
                "value": 26562
            },
            {
                "timestamp": 1589706720000,
                "value": 26562
            },
            {
                "timestamp": 1589706840000,
                "value": 26562
            },
            {
                "timestamp": 1589706960000,
                "value": 3834
            },
            {
                "timestamp": 1589707080000,
                "value": 3834
            },
            {
                "timestamp": 1589707200000,
                "value": 83909
            },
            {
                "timestamp": 1589707320000,
                "value": 83909
            },
            {
                "timestamp": 1589707440000,
                "value": 83909
            },
            {
                "timestamp": 1589707560000,
                "value": 7963
            },
            {
                "timestamp": 1589707680000,
                "value": 7963
            },
            {
                "timestamp": 1589707800000,
                "value": 9111
            },
            {
                "timestamp": 1589707920000,
                "value": 9111
            },
            {
                "timestamp": 1589708040000,
                "value": 9111
            },
            {
                "timestamp": 1589708160000,
                "value": 8464
            },
            {
                "timestamp": 1589708280000,
                "value": 8464
            },
            {
                "timestamp": 1589781360000,
                "value": 0
            },
            {
                "timestamp": 1589781480000,
                "value": 0
            },
            {
                "timestamp": 1589781600000,
                "value": 0
            },
            {
                "timestamp": 1589781720000,
                "value": 17101
            },
            {
                "timestamp": 1589781840000,
                "value": 17101
            },
            {
                "timestamp": 1589781960000,
                "value": 7178
            },
            {
                "timestamp": 1589782080000,
                "value": 7178
            },
            {
                "timestamp": 1589782200000,
                "value": 7178
            },
            {
                "timestamp": 1589782320000,
                "value": 39974
            },
            {
                "timestamp": 1589782440000,
                "value": 39974
            },
            {
                "timestamp": 1589782560000,
                "value": 9083
            },
            {
                "timestamp": 1589782680000,
                "value": 9083
            },
            {
                "timestamp": 1589782800000,
                "value": 9083
            },
            {
                "timestamp": 1589782920000,
                "value": 18854
            },
            {
                "timestamp": 1589783040000,
                "value": 18854
            },
            {
                "timestamp": 1589783160000,
                "value": 3950
            },
            {
                "timestamp": 1589783280000,
                "value": 3950
            },
            {
                "timestamp": 1589783400000,
                "value": 3950
            },
            {
                "timestamp": 1589783520000,
                "value": 60156
            },
            {
                "timestamp": 1589783640000,
                "value": 60156
            },
            {
                "timestamp": 1589783760000,
                "value": 0
            },
            {
                "timestamp": 1589783880000,
                "value": 0
            },
            {
                "timestamp": 1589784000000,
                "value": 0
            },
            {
                "timestamp": 1589784120000,
                "value": 98750
            },
            {
                "timestamp": 1589784240000,
                "value": 98750
            },
            {
                "timestamp": 1589784360000,
                "value": 0
            },
            {
                "timestamp": 1589784480000,
                "value": 0
            },
            {
                "timestamp": 1589784600000,
                "value": 0
            },
            {
                "timestamp": 1589784720000,
                "value": 7495
            },
            {
                "timestamp": 1589784840000,
                "value": 7495
            },
            {
                "timestamp": 1589784960000,
                "value": 5542
            },
            {
                "timestamp": 1589785080000,
                "value": 5542
            },
            {
                "timestamp": 1589785200000,
                "value": 5542
            },
            {
                "timestamp": 1589785320000,
                "value": 32767
            },
            {
                "timestamp": 1589785440000,
                "value": 32767
            },
            {
                "timestamp": 1589785560000,
                "value": 7286
            },
            {
                "timestamp": 1589785680000,
                "value": 7286
            },
            {
                "timestamp": 1589785800000,
                "value": 7286
            },
            {
                "timestamp": 1589785920000,
                "value": 12984
            },
            {
                "timestamp": 1589786040000,
                "value": 12984
            },
            {
                "timestamp": 1589786160000,
                "value": 2631
            },
            {
                "timestamp": 1589786280000,
                "value": 2631
            },
            {
                "timestamp": 1589786400000,
                "value": 2631
            },
            {
                "timestamp": 1589786520000,
                "value": 12898
            },
            {
                "timestamp": 1589786640000,
                "value": 12898
            },
            {
                "timestamp": 1589786760000,
                "value": 0
            },
            {
                "timestamp": 1589786880000,
                "value": 0
            },
            {
                "timestamp": 1589787000000,
                "value": 0
            },
            {
                "timestamp": 1589787120000,
                "value": 18164
            },
            {
                "timestamp": 1589787240000,
                "value": 18164
            },
            {
                "timestamp": 1589787360000,
                "value": 2771
            },
            {
                "timestamp": 1589787480000,
                "value": 2771
            },
            {
                "timestamp": 1589787600000,
                "value": 2771
            },
            {
                "timestamp": 1589787720000,
                "value": 14792
            },
            {
                "timestamp": 1589787840000,
                "value": 14792
            },
            {
                "timestamp": 1589787960000,
                "value": 7130
            },
            {
                "timestamp": 1589788080000,
                "value": 7130
            },
            {
                "timestamp": 1589788200000,
                "value": 7130
            },
            {
                "timestamp": 1589788320000,
                "value": 105823
            },
            {
                "timestamp": 1589788440000,
                "value": 105823
            },
            {
                "timestamp": 1589788560000,
                "value": 0
            },
            {
                "timestamp": 1589788680000,
                "value": 0
            },
            {
                "timestamp": 1589788800000,
                "value": 0
            },
            {
                "timestamp": 1589788920000,
                "value": 32092
            },
            {
                "timestamp": 1589789040000,
                "value": 32092
            },
            {
                "timestamp": 1589789160000,
                "value": 0
            },
            {
                "timestamp": 1589789280000,
                "value": 0
            },
            {
                "timestamp": 1589789400000,
                "value": 0
            },
            {
                "timestamp": 1589789520000,
                "value": 15252
            },
            {
                "timestamp": 1589789640000,
                "value": 15252
            },
            {
                "timestamp": 1589789760000,
                "value": 7488
            },
            {
                "timestamp": 1589789880000,
                "value": 7488
            },
            {
                "timestamp": 1589790000000,
                "value": 7488
            },
            {
                "timestamp": 1589790120000,
                "value": 31902
            },
            {
                "timestamp": 1589790240000,
                "value": 31902
            },
            {
                "timestamp": 1589790360000,
                "value": 0
            },
            {
                "timestamp": 1589790480000,
                "value": 0
            },
            {
                "timestamp": 1589790600000,
                "value": 0
            },
            {
                "timestamp": 1589790720000,
                "value": 93369
            },
            {
                "timestamp": 1589790840000,
                "value": 93369
            },
            {
                "timestamp": 1589790960000,
                "value": 0
            },
            {
                "timestamp": 1589791080000,
                "value": 0
            },
            {
                "timestamp": 1589791200000,
                "value": 0
            },
            {
                "timestamp": 1589791320000,
                "value": 23921
            },
            {
                "timestamp": 1589791440000,
                "value": 23921
            },
            {
                "timestamp": 1589791560000,
                "value": 4610
            },
            {
                "timestamp": 1589791680000,
                "value": 4610
            },
            {
                "timestamp": 1589791800000,
                "value": 4610
            },
            {
                "timestamp": 1589791920000,
                "value": 47816
            },
            {
                "timestamp": 1589792040000,
                "value": 47816
            },
            {
                "timestamp": 1589792160000,
                "value": 7735
            },
            {
                "timestamp": 1589792280000,
                "value": 7735
            },
            {
                "timestamp": 1589792400000,
                "value": 7735
            },
            {
                "timestamp": 1589792520000,
                "value": 47674
            },
            {
                "timestamp": 1589792640000,
                "value": 47674
            },
            {
                "timestamp": 1589792760000,
                "value": 5617
            },
            {
                "timestamp": 1589792880000,
                "value": 5617
            },
            {
                "timestamp": 1589793000000,
                "value": 5617
            },
            {
                "timestamp": 1589793120000,
                "value": 8679
            },
            {
                "timestamp": 1589793240000,
                "value": 8679
            },
            {
                "timestamp": 1589793360000,
                "value": 8636
            },
            {
                "timestamp": 1589793480000,
                "value": 8636
            },
            {
                "timestamp": 1589793600000,
                "value": 8636
            },
            {
                "timestamp": 1589793720000,
                "value": 8857
            },
            {
                "timestamp": 1589793840000,
                "value": 8857
            },
            {
                "timestamp": 1589793960000,
                "value": 0
            },
            {
                "timestamp": 1589794080000,
                "value": 0
            },
            {
                "timestamp": 1589794200000,
                "value": 0
            },
            {
                "timestamp": 1589794320000,
                "value": 26484
            },
            {
                "timestamp": 1589794440000,
                "value": 26484
            },
            {
                "timestamp": 1589794560000,
                "value": 0
            },
            {
                "timestamp": 1589794680000,
                "value": 0
            },
            {
                "timestamp": 1589794800000,
                "value": 0
            },
            {
                "timestamp": 1589794920000,
                "value": 48583
            },
            {
                "timestamp": 1589795040000,
                "value": 48583
            },
            {
                "timestamp": 1589795160000,
                "value": 11910
            },
            {
                "timestamp": 1589795280000,
                "value": 11910
            },
            {
                "timestamp": 1589795400000,
                "value": 11910
            },
            {
                "timestamp": 1589795520000,
                "value": 113094
            },
            {
                "timestamp": 1589795640000,
                "value": 113094
            },
            {
                "timestamp": 1589795760000,
                "value": 6767
            },
            {
                "timestamp": 1589795880000,
                "value": 6767
            },
            {
                "timestamp": 1589796000000,
                "value": 6767
            },
            {
                "timestamp": 1589796120000,
                "value": 124816
            },
            {
                "timestamp": 1589796240000,
                "value": 124816
            },
            {
                "timestamp": 1589796360000,
                "value": 0
            },
            {
                "timestamp": 1589796480000,
                "value": 0
            },
            {
                "timestamp": 1589796600000,
                "value": 0
            },
            {
                "timestamp": 1589796720000,
                "value": 57681
            },
            {
                "timestamp": 1589796840000,
                "value": 57681
            },
            {
                "timestamp": 1589796960000,
                "value": 0
            },
            {
                "timestamp": 1589797080000,
                "value": 0
            },
            {
                "timestamp": 1589797200000,
                "value": 0
            },
            {
                "timestamp": 1589797320000,
                "value": 80948
            },
            {
                "timestamp": 1589797440000,
                "value": 80948
            },
            {
                "timestamp": 1589797560000,
                "value": 0
            },
            {
                "timestamp": 1589797680000,
                "value": 0
            },
            {
                "timestamp": 1589797800000,
                "value": 0
            },
            {
                "timestamp": 1589797920000,
                "value": 26387
            },
            {
                "timestamp": 1589798040000,
                "value": 26387
            },
            {
                "timestamp": 1589798160000,
                "value": 0
            },
            {
                "timestamp": 1589798280000,
                "value": 0
            },
            {
                "timestamp": 1589798400000,
                "value": 0
            },
            {
                "timestamp": 1589798520000,
                "value": 26068
            },
            {
                "timestamp": 1589798640000,
                "value": 26068
            },
            {
                "timestamp": 1589798760000,
                "value": 0
            },
            {
                "timestamp": 1589798880000,
                "value": 0
            },
            {
                "timestamp": 1589799000000,
                "value": 0
            },
            {
                "timestamp": 1589799120000,
                "value": 96607
            },
            {
                "timestamp": 1589799240000,
                "value": 96607
            },
            {
                "timestamp": 1589799360000,
                "value": 1979
            },
            {
                "timestamp": 1589799480000,
                "value": 1979
            },
            {
                "timestamp": 1589799600000,
                "value": 1979
            },
            {
                "timestamp": 1589799720000,
                "value": 19978
            },
            {
                "timestamp": 1589799840000,
                "value": 19978
            },
            {
                "timestamp": 1589799960000,
                "value": 5057
            },
            {
                "timestamp": 1589800080000,
                "value": 5057
            },
            {
                "timestamp": 1589800200000,
                "value": 5057
            },
            {
                "timestamp": 1589800320000,
                "value": 18425
            },
            {
                "timestamp": 1589800440000,
                "value": 18425
            },
            {
                "timestamp": 1589800560000,
                "value": 5247
            },
            {
                "timestamp": 1589800680000,
                "value": 5247
            },
            {
                "timestamp": 1589800800000,
                "value": 5247
            },
            {
                "timestamp": 1589800920000,
                "value": 39670
            },
            {
                "timestamp": 1589801040000,
                "value": 39670
            },
            {
                "timestamp": 1589801160000,
                "value": 6684
            },
            {
                "timestamp": 1589801280000,
                "value": 6684
            },
            {
                "timestamp": 1589801400000,
                "value": 6684
            },
            {
                "timestamp": 1589801520000,
                "value": 5328
            },
            {
                "timestamp": 1589801640000,
                "value": 5328
            },
            {
                "timestamp": 1589801760000,
                "value": 7155
            },
            {
                "timestamp": 1589801880000,
                "value": 7155
            },
            {
                "timestamp": 1589802000000,
                "value": 7155
            },
            {
                "timestamp": 1589802120000,
                "value": 5653
            },
            {
                "timestamp": 1589802240000,
                "value": 5653
            },
            {
                "timestamp": 1589802360000,
                "value": 0
            },
            {
                "timestamp": 1589802480000,
                "value": 0
            },
            {
                "timestamp": 1589802600000,
                "value": 0
            },
            {
                "timestamp": 1589802720000,
                "value": 82627
            },
            {
                "timestamp": 1589802840000,
                "value": 82627
            },
            {
                "timestamp": 1589802960000,
                "value": 6058
            },
            {
                "timestamp": 1589803080000,
                "value": 6058
            },
            {
                "timestamp": 1589803200000,
                "value": 6058
            },
            {
                "timestamp": 1589803320000,
                "value": 52149
            },
            {
                "timestamp": 1589803440000,
                "value": 52149
            },
            {
                "timestamp": 1589803560000,
                "value": 52149
            },
            {
                "timestamp": 1589805000000,
                "value": 1719
            },
            {
                "timestamp": 1589805120000,
                "value": 1719
            },
            {
                "timestamp": 1589805240000,
                "value": 0
            },
            {
                "timestamp": 1589805360000,
                "value": 0
            },
            {
                "timestamp": 1589805480000,
                "value": 0
            },
            {
                "timestamp": 1589805600000,
                "value": 4536
            },
            {
                "timestamp": 1589805720000,
                "value": 4536
            },
            {
                "timestamp": 1589805840000,
                "value": 4536
            }
        ]
    },
  
  ]
  draw(data);

//   d3.csv('https://vizhub.com/curran/datasets/data-canvas-sense-your-city-one-week.csv')
//     .then(data => {
function draw(data) {
    data.forEach(item => {
        console.log(item)
        item.metrics.forEach(d => {
            d.temperature = +d.value;
            d.timestamp = new Date(d.timestamp);
        })
    });
    render(data);
}
    // });

}(d3));