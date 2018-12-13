// Milou van Casteren
// DataProcessing Week 6 & 7
// D3 linked views

//Width and height
var w = 800;
var h = 600;

//Define map projection
var projection = d3.geoMercator() //utiliser une projection standard pour aplatir les pôles, voir D3 projection plugin
                    .center([ 13, 52 ]) //comment centrer la carte, longitude, latitude
                    .translate([ w/2, h/2 ]) // centrer l'image obtenue dans le svg
                    .scale([ w/1.5 ]); // zoom, plus la valeur est petit plus le zoom est gros

//Define path generator
var path = d3.geoPath()
              .projection(projection);

//Create SVG
var svg = d3.select("#container")
              .append("svg")
              .attr("width", w)
              .attr("height", h);

var countries = [];
var all_countries = [];
var requests = [d3.json("countries.json"), d3.json("linked.json")];

Promise.all(requests).then(function(res) {
    makeMap(res[0], res[1])
}).catch(function(d){
    throw(d);
    });

function makeMap(json, data){

  for (i in json.features) {
    all_countries.push(json.features[i].properties.admin)
  }

  for (key in data){
    countries.push(key)
  }

  var tool_tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-8, 0])
      .html(function(d) {
        return "Country: " + d.properties.admin + "<br>" + "QOL: " + data[d.properties.admin]["Quality of Life Index"];
      });
  svg.call(tool_tip);


  //Bind data and create one path per GeoJSON feature
  svg.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("stroke", "rgba(8, 81, 156, 0.2)")
      .attr("fill", function(d){ return "rgba(8, 81, 156, 0.6)" })
      .on('mouseover', tool_tip.show)
      .on('mouseout', tool_tip.hide)
      .on("click", function(d) {
        makeBarchart(d.properties.admin, data)
      });
  };

  function makeBarchart(country, data){

    d3.select("bars").remove();
    keys = Object.keys(data[country])
    values = [];


    for (i in keys){
            console.log(keys)
            values.push(data[country][keys[i]]);
    }

    // remove non-indeces from data
    keys.splice(0, 1)
    keys.splice(5, 1)
    values.splice(0, 1)
    values.splice(5, 1)

    for (i in keys){
      keys[i] = keys[i].replace("Index", "")
    }

    //Width and height
    var width = 600;
    var height = 500;

    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 1200 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    var svg = d3.select("#barchart")
                  .append("svg")
                  .attr("id", "bars")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

    d3.select("#titlebarchart")
        .append("h1")
        .text(country)
    // Set the ranges
    var x = d3.scaleBand()
                .range([0, width])
                .padding(0.1);
    var y = d3.scaleLinear()
                .range([height, 0]);

    // Scale the range of the data in the domains
    x.domain(keys);
    y.domain([0, d3.max(values, function(d) {
             return d;
     })]);

     var tool_tip = d3.tip()
                        .attr("class", "d3-tip")
                        .offset([-8, 0])
                        .html(function(d) {
                          return d
                        });
     svg.call(tool_tip);

      // Create bars
      svg.selectAll(".bar")
          .data(values)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d, i) { return x(keys[i]); })
          .attr("width", x.bandwidth())
          .attr("y", function(d) { return y(d); })
          .attr("height", function(d) { return height - y(d) })
          .on('mouseover', tool_tip.show)
          .on('mouseout', tool_tip.hide);

      // Add x axis
      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x))
          .style("font-size","10px");


      // Add y axis
      svg.append("g")
          .call(d3.axisLeft(y));

          // text label for the y axis
      svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x",0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Index value");



}
