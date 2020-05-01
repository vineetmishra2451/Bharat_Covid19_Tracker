
var dataToArray = [["State",'Recovered','Deaths','Active Cases','Total Cases']];

$.getJSON(
    'https://api.covid19india.org/data.json', 
    function(data) {
        objectToArray(data.statewise);
        updateCounter(data.cases_time_series); 
        chartTesting(data.tested);
        chartDeceased(data.cases_time_series);
        chartCases(data.cases_time_series);
        chartRecovered(data.cases_time_series);
        doublingRate(data.cases_time_series);
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
  hAxis: {title: 'Recovered',
          gridlines :{color:'#aacfcf'}},
  vAxis: {title: 'Died',
  gridlines :{color:'#ffb6b6'}},
  colorAxis :{colors:['#0c9463','#ffd31d','#e32249']},
  backgroundColor : 'none',
  bubble: {textStyle: {fontSize: 10,bold :true}},  
 };

var chart = new google.visualization.BubbleChart(document.getElementById('series_chart_div'));
chart.draw(data, options);

}
/*******************Line Charts******************/
var dRateArray = [];
var testingTotal = [];
var testingPositive = [];
var recoveredArray = [];
var casesArray = [];
var deceasedArray = [];

/**************Doubling Rate Calculator**********/
function doublingRate(data) {
  var sum = 0;
  for (let i = data.length-1, n = 1; n <= 7; i--, n++) {
    sum += parseInt(data[i].dailyconfirmed);
  }
  var avg = sum / 7;
  var perc = (avg * 100) / parseInt(data[data.length - 1].totalconfirmed);
  var dRate = 72 / perc; //using rule of 72
  dRate = dRate.toFixed(2);
  var currentCases =parseInt(data[data.length - 1].totalconfirmed) ;
  var day = document.querySelector("#days");
  day.innerHTML='<span class="fa-layers fa-fw" style="background:white">'+
                '<i class="fad fa-calendar">'+
                '</i><span class="fa-layers-text" data-fa-transform="shrink-12 down-3" style="font-weight:900">' + dRate + 
                '</span></span>';                
  
  for (let i = 0; i <= parseInt(dRate)+1; i++) {
    let arr;
    if (i == 0) {
      arr = [i, currentCases];
      dRateArray.push(arr);
    }
    else {
      currentCases += currentCases * 0.05;
      arr = [i, currentCases];
      dRateArray.push(arr);
    }
  }
}
//Chart
google.charts.load('current', {'packages':['line']});
      google.charts.setOnLoadCallback(dRateChart);

    function dRateChart() {

      var data = new google.visualization.DataTable();
      data.addColumn('number', 'Day');
      data.addColumn('number', 'Cases');

      data.addRows(dRateArray);

      var options = {
        colors:'red',
        backgroundColor : 'none',
        hAxis: {         
          textStyle: {
              color: "#bb3b0e",
              fontName: "sans-serif",
              fontSize: 12,
              bold: false,
              italic: false
          },
          
      },
      vAxis: {
        textStyle: {
            color: "#bb3b0e",
            fontName: "sans-serif",
            fontSize: 12,
            bold: false,
            italic: false
        }
    },
    colors: '#bb3b0e',
    };

      var chart = new google.charts.Line(document.getElementById('dRateChart'));

      chart.draw(data, google.charts.Line.convertOptions(options));
    }

/******************Testings***************/
function chartTesting(data){
  //Updating Counter
  var testdone = document.querySelector("#testsDone");
  var plus = document.querySelector("#plus");
  var tillDate = document.querySelector("#date");
  testdone.textContent = data[data.length-1].totalsamplestested;
  plus.textContent = '+' + (data[data.length-1].totalsamplestested - data[data.length-2].totalsamplestested);
  var tempDate = data[data.length-1].updatetimestamp.split(" ");
  tillDate.textContent = tempDate.shift();
  //Assigning data to array for charts
    for(let i=0;i<data.length;i++){
    if(data[i].totalsamplestested!==""){
        var date = data[i].updatetimestamp.split(" ");
        date = date.shift();
        var total;
        if(i==0) 
          total =  parseInt(data[i].totalsamplestested)
        else
           total = parseInt(data[i].totalsamplestested - lastTotal );
        var arr = [date,total];
        testingTotal.push(arr);
        var lastTotal = data[i].totalsamplestested;
    }
    if(data[i].testpositivityrate!==""){
        var positive = parseFloat(data[i].testpositivityrate);
        let arr1 = [date,positive]
        testingPositive.push(arr1);
    }
  }
}
//Total
google.charts.load('current', {'packages':['line']});
      google.charts.setOnLoadCallback(testingChartTotal);

    function testingChartTotal() {

      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Date');
      data.addColumn('number', 'Tested');

      data.addRows(testingTotal);

      var options = {
        colors:'red',
        backgroundColor : 'none',
        hAxis: {
          textStyle: {
              color: "#ffa34d",
              fontName: "sans-serif",
              fontSize: 10,
              bold: false,
              italic: false
          }
      },
      vAxis: {
        textStyle: {
            color: "#ffa34d",
            fontName: "sans-serif",
            fontSize: 10,
            bold: false,
            italic: false
        }
    },
    colors: '#ffa34d',
    };

      var chart = new google.charts.Line(document.getElementById('tested'));

      chart.draw(data, google.charts.Line.convertOptions(options));
    }
//Positivity Rate

google.charts.load('current', {'packages':['line']});
google.charts.setOnLoadCallback(testingChartPositive);

function testingChartPositive() {

var data = new google.visualization.DataTable();
data.addColumn('string', 'Date');
data.addColumn('number', 'Positivity Rate(%)');

data.addRows(testingPositive);

var options = {
  backgroundColor : 'none',
  hAxis: {
    textStyle: {
        color: "#00bdaa",
        fontName: "sans-serif",
        fontSize: 10,
        bold: false,
        italic: false
    }
},
vAxis: {
  textStyle: {
      color: "#00bdaa",
      fontName: "sans-serif",
      fontSize: 10,
      bold: false,
      italic: false
  }
},
colors: '#00bdaa',
};

var chart = new google.charts.Line(document.getElementById('positive'));

chart.draw(data, google.charts.Line.convertOptions(options));
}

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
              color: "#8cba51",
              fontName: "sans-serif",
              fontSize: 12,
              bold: true,
              italic: false
          }
      },
      vAxis: {
        textStyle: {
            color: "#8cba51",
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
              color: "#f64b3c",
              fontName: "sans-serif",
              fontSize: 12,
              bold: true,
              italic: false
          }
      },
      vAxis: {
        textStyle: {
            color: "#f64b3c",
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
              color: "#035aa6",
              fontName: "sans-serif",
              fontSize: 12,
              bold: true,
              italic: false
          }
      },
      vAxis: {
        textStyle: {
            color: "#035aa6",
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

function updateCounter(data){
  var update = data[data.length-1];
  var newDeaths = document.querySelector("#plusDeaths")
  var newRecovered = document.querySelector("#plusRecovered")
  var newActive = document.querySelector("#plusActive")
  var newTotal = document.querySelector("#plusTotal")

  newTotal.innerHTML = '<i class="fad fa-chevron-up totalUp"></i>  ' + update.dailyconfirmed;
  newRecovered.innerHTML = '<i class="fad fa-chevron-up recoveredUp"></i>  ' +  update.dailyrecovered;
  newDeaths.innerHTML = '<i class="fad fa-chevron-up deathsUp"></i>  ' + update.dailydeceased;
}