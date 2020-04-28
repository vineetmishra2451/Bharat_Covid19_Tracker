
var dataToArray = [["State",'Recovered','Deaths','Active Cases','Total Cases']];

$.getJSON(
    'https://api.covid19india.org/data.json', 
    function(data) {
        objectToArray(data.statewise) ;
       dailyToArray(data.cases_time_series);
        console.log(data.cases_time_series)
    });
function objectToArray(data){
  data.forEach(function(s,i){
    if(i!=0){
      var arr = [s.state,parseInt(s.deaths),parseInt(s.recovered),parseInt(s.active),parseInt(s.confirmed)];
      dataToArray.push(arr);
    }
    else {
      total(data[0]);
    }
  })
}    



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
var mainArray = [];

google.charts.load('current', {'packages':['line']});
      google.charts.setOnLoadCallback(drawChart);

    function drawChart() {

      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Date');
      data.addColumn('number', 'Deceased');
      data.addColumn('number', 'Confirmed');
      data.addColumn('number', 'Recovered');

      data.addRows(mainArray);

      var options = {
        chart: {
          title: 'Number of Deceased, Recovered and Covid-19 Confirmed Cases on daily basis',
        },
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

      var chart = new google.charts.Line(document.getElementById('line_top_x'));

      chart.draw(data, google.charts.Line.convertOptions(options));
    }

  function dailyToArray(data){
    
    data.forEach(function(day){
      var date = day.date
      var died = parseInt(day.dailydeceased) 
      var total = parseInt(day.dailyconfirmed)
      var recovered = parseInt(day.dailyrecovered)
      var arr = [date,died,total,recovered]
      mainArray.push(arr)

    })
  }


