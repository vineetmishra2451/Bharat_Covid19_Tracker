
var dataToArray = [["State",'Recovered','Deaths','Active Cases','Total Cases']];

$.getJSON(
    'https://api.covid19india.org/data.json', 
    function(data) {
        objectToArray(data.statewise); 
        
        chartDeceased(data.cases_time_series);
        chartCases(data.cases_time_series);
        chartRecovered(data.cases_time_series);
    });    
function objectToArray(data){
  data.forEach(function(s,i){
    if(i!=0){
      var arr = [s.state,parseInt(s.deaths),parseInt(s.recovered),parseInt(s.active),parseInt(s.confirmed)];
      dataToArray.push(arr);
    }
    else {
      total(data[0]);//for the total cases
    }
  })
}    
/***********************Bubble Chart************************/
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawSeriesChart);


function drawSeriesChart() {

var data = new google.visualization.arrayToDataTable(dataToArray);

var options = {
  title: 'Number of Deaths, Recovered Patients, Active Cases ' +
         'and Total Cases of Indian States (Live)',
  hAxis: {title: 'Recovered'},
  vAxis: {title: 'Died'},
  colorAxis :{colors:['green','yellow','red']},
  backgroundColor : 'none',
  bubble: {textStyle: {fontSize: 12}}      };

var chart = new google.visualization.BubbleChart(document.getElementById('series_chart_div'));
chart.draw(data, options);

}

/*******************Line Charts******************/


var recoveredArray = [];
var casesArray = [];
var deceasedArray = [];



/******************Recovered**************/

function chartRecovered(data){
    
  data.forEach(function(day){
    if(day.dailyrecovered>0){
      
    var date = day.date
    var recovered = parseInt(day.dailyrecovered)
    var arr = [date,recovered]
    recoveredArray.push(arr)

    }
  })
}



google.charts.load('current', {'packages':['line']});
      google.charts.setOnLoadCallback(chartOfRecovered);

    function chartOfRecovered() {

      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Date');
      data.addColumn('number', 'Recovered');

      data.addRows(recoveredArray);

      var options = {
        backgroundColor : 'none',
        hAxis: {
          textStyle: {
              color: "#000",
              fontName: "sans-serif",
              fontSize: 12,
              bold: true,
              italic: false
          }
      },
      vAxis: {
        textStyle: {
            color: "#000",
            fontName: "sans-serif",
            fontSize: 12,
            bold: true,
            italic: false
        }
    },
    colors: 'green',
    };

      var chart = new google.charts.Line(document.getElementById('recoveredChart'));

      chart.draw(data, google.charts.Line.convertOptions(options));
    }


/******************Deceased**********************/

function chartDeceased(data){
    
  data.forEach(function(day){
    if(day.dailydeceased>0){
    var date = day.date
    var died = parseInt(day.dailydeceased) 
    var arr = [date,died]
    deceasedArray.push(arr)
    }

  })
}


google.charts.load('current', {'packages':['line']});
      google.charts.setOnLoadCallback(chartOFDeceased);

    function chartOFDeceased() {

      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Date');
      data.addColumn('number', 'Deceased');

      data.addRows(deceasedArray);

      var options = {

        backgroundColor : 'none',
        hAxis: {
          textStyle: {
              color: "#000",
              fontName: "sans-serif",
              fontSize: 12,
              bold: true,
              italic: false
          }
      },
      vAxis: {
        textStyle: {
            color: "#000",
            fontName: "sans-serif",
            fontSize: 12,
            bold: true,
            italic: false
        }
    },
    colors:'red'
    };

      var chart = new google.charts.Line(document.getElementById('deceased'));

      chart.draw(data, google.charts.Line.convertOptions(options));
    }

/*****************Cases******************/
function chartCases(data){
    
  data.forEach(function(day){
    if(day.dailyconfirmed>0){
    var date = day.date 
    var total = parseInt(day.dailyconfirmed)
    var arr = [date,total]
    casesArray.push(arr)
    }
  })
}


google.charts.load('current', {'packages':['line']});
      google.charts.setOnLoadCallback(chartOfCases);

    function chartOfCases() {

      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Date');
      data.addColumn('number', 'Cases');

      data.addRows(casesArray);

      var options = {
        selectionMode : 'multiple',
        backgroundColor : 'none', 
        hAxis: {
          textStyle: {
              color: "#000",
              fontName: "sans-serif",
              fontSize: 12,
              bold: true,
              italic: false
          }
      },
      vAxis: {
        textStyle: {
            color: "#000",
            fontName: "sans-serif",
            fontSize: 12,
            bold: true,
            italic: false
        }
    } 
    };

      var chart = new google.charts.Line(document.getElementById('cases'));

      chart.draw(data, google.charts.Line.convertOptions(options));
    }



//function to assign values to main counter 

function total(data){
  var totalCases = document.querySelector("#total")
  totalCases.textContent = data.confirmed

  var activeCases = document.querySelector("#active")
  activeCases.textContent = data.active

  var recovered = document.querySelector("#recovered")
  recovered.textContent = data.recovered

  var deaths = document.querySelector("#deaths")
  deaths.textContent = data.deaths
}