// Milou van Casteren
// 10992340
// DataProcessing Week 5
// scatterplot

var women_in_science = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
var consumer_confidence = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"


window.onload = function() {
  var requests = [d3.json(women_in_science), d3.json(consumer_confidence)];

  Promise.all(requests).then(function(response) {
      var data_wis = transformResponse(response[0])
      var data_cc = transformResponse(response[1])
      scatterplot(data_cc, data_wis)
  }).catch(function(d){
      throw(d);
      });
  };

  function scatterplot(data_cc, data_wis){
    // set margins
    var margin = {top: 100, right: 100, bottom: 100, left: 50},
                  width = 1000 - margin.left - margin.right,
                  height = 800 - margin.top - margin.bottom;

    // create SVG element
    var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // scale the x-axis
    var xscale = d3.scaleLinear()
      .domain([98,102.5])
      .range([0,width]);

    // scale the y-axis
    var yscale = d3.scaleLinear()
      .domain([10,50])
      .range([height,0]);

    // scale ticks on x-axis
    var xAxis = d3.axisBottom()
      .tickSize(-height)
      .scale(xscale);

    // scale ticks on y-axis
    var yAxis = d3.axisLeft()
      .tickSize(-width)
      .scale(yscale)

    // colors for bubbles
    colors = ['#f7fcf0','#e0f3db','#ccebc5','#a8ddb5','#7bccc4','#4eb3d3','#2b8cbe','#0868ac','#084081']


    // create title above plot
    svg.append("text")
          .attr("x", (width / 2))
          .attr("y", 0 - (margin.top / 2))
          .attr("text-anchor", "middle")
          .style("font-family: verdana", "font-size", "45px")
          .text("Women in science - Customer confidence");

    // set xAxis
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "x axis")
      .call(xAxis);

    // set yAxis
    svg.append("g")
      .attr("transform", "translate(0,0)")
      .attr("class", "y axis")
      .call(yAxis);

    // make coordinates of data
    count = 0
    all_data = []
    years = []

    for (i in data_cc){
      if (data_cc[i].time == data_wis[i - count].time) {
        all_data.push([data_cc[i].datapoint, data_wis[i - count].datapoint])
        years.push(data_cc[i].time)
      } else{
        count += 1
      }
    }

    // plot dots
    svg.selectAll("circle")
     .data(all_data)
     .enter()
     .append("circle")
     .attr("cx", function(d) {
          return xscale(d[0]);
     })
     .attr("cy", function(d) {
          return yscale(d[1]);
     })
     .attr("r", 10)
     .style("fill", function(d, i){
       return colors[i % 9]
     });

     // y-axis label
     svg.append("text")
       .attr("x", 6)
       .attr("y", -2)
       .attr("class", "label")
       .text("% Women In Science");

     // x-axis label
     svg.append("text")
       .attr("x", width-2)
       .attr("y", height+35)
       .attr("text-anchor", "end")
       .attr("class", "label")
       .text("Consumer Confidence Index");

    var unique_years = Array.from(new Set(years))

    var legend = svg.append("g")
                .attr("class","legend")
                .attr("height", 30)
                .attr("width", 70)
                .attr("transform","translate(20,50)");

    // legend
    legend.append("text")
      .attr("x",10)
      .attr("y", 590)
      .text("Legend")

    // create legend
    legend.selectAll('rect')
      .data(unique_years)
      .enter()
      .append("rect")
          .attr("y", 600)
          .attr("x", function(d, e){
            return e * 40;
          })
          .attr("width", 15)
          .attr("height", 15)
          .style("fill", function (f, g) {
              return colors[g]
          })

    legend.selectAll('text')
          .data(unique_years)
          .enter()
          .append("text")
          .attr("y", 630)
          .attr("x", function(d, e){
            return e * 40;
          })
          .text(function (f, g) {
                return unique_years[g]
            })
          .style("font-size", "14px")

  }

  function transformResponse(data){

    // access data property of the response
    let dataHere = data.dataSets[0].series;

    // access variables in the response and save length for later
    let series = data.structure.dimensions.series;
    let seriesLength = series.length;

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });

    // get the time periods in the dataset
    let observation = data.structure.dimensions.observation[0];

    // add time periods to the variables, but since it's not included in the
    // 0:0:0 format it's not included in the array of lengths
    varArray.push(observation);

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);

    // set up output array, an array of objects, each containing a single datapoint
    // and the descriptors for that datapoint
    let dataArray = [];

    // for each string that we created
    strings.forEach(function(string){
        // for each observation and its index
        observation.values.forEach(function(obs, index){
            let data = dataHere[string].observations[index];
            if (data != undefined){

                // set up temporary object
                let tempObj = {};

                let tempString = string.split(":").slice(0, -1);
                tempString.forEach(function(s, indexi){
                    tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
                });

                // every datapoint has a time and ofcourse a datapoint
                tempObj["time"] = obs.name;
                tempObj["datapoint"] = data[0];
                dataArray.push(tempObj);
            }
        });
    });

    // return the finished product!
    return dataArray;
}
