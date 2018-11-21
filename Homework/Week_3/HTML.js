// Milou van Casteren
// minor programmeren
// Data processing
// Javascript

var fileName = "KNMI.json";
var txtFile = new XMLHttpRequest();

// read in json file containing data
txtFile.onreadystatechange = function () {
  if (txtFile.readyState === 4 && txtFile.status == 200) {
    object1 = JSON.parse(txtFile.responseText);

    keys = Object.keys(object1);

    var temp = []
    var date = []

    // loop over data and and the temperature and date to lists
    keys.forEach(function(element) {
      temp.push(object1[element]["TN"])
      date.push(new Date(element.slice(0, 4), (element.slice(4, 6) - 1), element.slice(6, 8)))
    });

    // Calculate the domains for x and y
    var max_temp = Math.max(...temp);
    var min_temp = Math.min(...temp);
    var first_date = date[0]
    var last_date = date[(date.length - 1)]

    // transform them with the width and height range
    yTransform = createTransform([min_temp, max_temp], [20, 300]);
    xTransform = createTransform([first_date, last_date], [20, 600]);

    // create a canvas with a line graph through all data points
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.font = '16px serif';
    ctx.fillText('Minimum temperatuur (in 0.1 graden Celsius), Schiphol (2018)', 180, 20);
    ctx.moveTo(xTransform(date[0]), yTransform(temp[0]))

    // drawing the lines through all data points
    for(var i = 0; i <= temp.length; i++){
      var ycoordinate = yTransform(temp[i])
      var xcoordinate = xTransform(date[i])
      console.log(ycoordinate)
      ctx.lineTo(xTransform(date[i]), yTransform(temp[i]));
      ctx.moveTo(xTransform(date[i]), yTransform(temp[i]))
    }

    ctx.stroke();
  }
}

txtFile.open("GET", fileName);
txtFile.send();

function createTransform(domain, range){
	// domain is a two-element array of the data bounds [domain_min, domain_max]
	// range is a two-element array of the screen bounds [range_min, range_max]
	// this gives you two equations to solve:
	// range_min = alpha * domain_min + beta
	// range_max = alpha * domain_max + beta
 		// a solution would be:

    var domain_min = domain[0]
    var domain_max = domain[1]
    var range_min = range[0]
    var range_max = range[1]

    // formulas to calculate the alpha and the beta
   	var alpha = (range_max - range_min) / (domain_max - domain_min)
    var beta = range_max - alpha * domain_max

    // returns the function for the linear transformation (y= a * x + b)
    return function(x){
      return alpha * x + beta;
    }
}
