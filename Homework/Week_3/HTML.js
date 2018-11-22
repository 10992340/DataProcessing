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
      var year = element.slice(0, 4)
      var month = (element.slice(4, 6) - 1)
      var day = element.slice(6, 8)

      temp.push(object1[element]["TN"])
      date.push(new Date(year, month, day))
    });

    // Calculate the domains for x and y
    var max_temp = Math.max(...temp);
    var min_temp = Math.min(...temp);
    var first_date = date[0]
    var last_date = date[(date.length - 1)]

    // transform them with the width and height range
    yTransform = createTransform([min_temp, max_temp], [25, 300]);
    xTransform = createTransform([first_date, last_date], [40, 600]);

    // create a canvas with a line graph through all data points
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    // graph title
    ctx.beginPath();

    ctx.font = '16px serif';
    ctx.fillText('Minimum temperature (in 0.1 degrees Celsius), Schiphol (2018)', 180, 20);
    ctx.closePath();

    // axis names
    ctx.font = '12px serif';
    ctx.fillText('--> Month', 550, 400);
    // ctx.rotate(90)
    ctx.font = '12px serif';
    ctx.fillText('temp', 5, 20);

    ctx.beginPath();
    temperatures = ['-5', '0', '5', '10', '15', '20', '25']
    for(var t = 0; t <= temperatures.length; t++) {
      ctx.lineWidth = 0.5;
      ctx.font='12px serif';
      ctx.moveTo(xTransform(first_date), yTransform(temperatures[t] * 10));
      ctx.lineTo(xTransform(last_date), yTransform(temperatures[t] * 10));
      ctx.fillText(temperatures[t] + ' °C', 5, yTransform(temperatures[t] * 10))
    }
    ctx.stroke();
    ctx.closePath();

    // months on the x axis
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
    for(var m = 0, s = 0; m <= months.length; m++, s+=30){
      ctx.font='12px serif';
      ctx.fillText('1 ' + months[m], xTransform(date[s]), 390)
    }

    // drawing the lines through all data points
    ctx.beginPath();
    for(var i = 0; i <= temp.length; i++){
      ctx.lineWidth = 1;
      ctx.lineTo(xTransform(date[i]), yTransform(temp[i]));
      ctx.moveTo(xTransform(date[i]), yTransform(temp[i]));
    }
    ctx.stroke();
    ctx.closePath();

    // Draw x and y axis
    ctx.beginPath();
    ctx.moveTo(xTransform(first_date), 25);
    ctx.lineWidth = 0.5;
    ctx.lineTo(xTransform(last_date), 25);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(xTransform(first_date), 20);
    ctx.lineWidth = 0.5;
    ctx.lineTo(xTransform(first_date), 370);
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
