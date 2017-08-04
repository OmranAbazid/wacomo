var ChartConfig = (function() {

  // variables
  var WEEK_DAYS = ["Sunday", "Monday", "Tuesday",
   "Wednesday", "Thursday", "Friday", "Saturday"];
  var DARK_BLUE_COLOR = "#0b3049";
  var LIGHT_BLUE_COLOR = "#7fa1b7";
  var X_GRID_COLOR = "rgba(0, 0, 0, 0)"; // tansparent
  var Y_GRID_COLOR = DARK_BLUE_COLOR;


  // generate the chart js data object from the array of consumption indexed by time
  // ([0 4 6 8 9 7 4]) => chartsjs data object with style config
  function generateData(consumptionArr, type) {
    var dataLabels = [];
    switch (type) {
      case "min":
        dataLabels = getRangeArr((new Date()).getMinutes() + 1);
        // last consumption is used in minutes to color the whole line graph
        var lastConsumption = consumptionArr[consumptionArr.length - 1];
        var bgColors = getLevelColor(lastConsumption, 0.3);
        var bdColors = getLevelColor(lastConsumption, 0.8);
        break;
      case "hour":
        dataLabels = getRangeArr((new Date()).getHours() + 1);
        var bgColors = [];
        var bdColors = [];
        consumptionArr.forEach(function(element) {
          bgColors.push(getLevelColor(element, 1));
          bgColors.push(getLevelColor(element, 0.5));
        });
        break;
      case "week":
        dataLabels = WEEK_DAYS;
        var bgColors = [];
        var bdColors = [];
        consumptionArr.forEach(function(element) {
          bgColors.push(getLevelColor(element, 1));
          bgColors.push(getLevelColor(element, 0.5));
        });
        break;
      default:
    }
    return {
      labels: dataLabels,
      datasets: [{
        backgroundColor: bgColors,
        borderWidth: 20,
        borderColor: bdColors,
        pointBorderColor: "#fff",
        borderWidth: 5,
        pointBorderWidth: 2,
        data: consumptionArr
      }]
    }
  }

  // if length(when current minute) = 5 => return [0 1 2 3 4 5] 
  // used to generate time labeles untill now
  function getRangeArr(length) {
    return Array.apply(null, Array(length)).map(function(_, i) {
      return i;
    })
  }

  // get the color of last point to color the graph accordingly
  // becuase consumption is comulative the last point represent the level
  function getLevelColor(consumptionLevel, opacity) {
    if (consumptionLevel <= 60)
      return "rgba(33, 135, 145," + opacity + ")";
    if (consumptionLevel > 60 && consumptionLevel <= 100)
      return "rgba(229, 217, 72, " + opacity + ")";
    if (consumptionLevel > 100)
      return "rgba(240, 78, 81, " + opacity + ")";
  }

  // generate option configuration object
  function generateOptions(chartType, data, xlabel, ylabel) {
    Chart.defaults.global.defaultFontColor = LIGHT_BLUE_COLOR;
    return {
      type: chartType,
      data: data,
      options: {
        scales: {
          xAxes: [{
            stacked: false,
            gridLines: {
              color: X_GRID_COLOR,
            },
            scaleLabel: {
              display: true,
              labelString: xlabel
            },
            ticks:{
              fontColor: LIGHT_BLUE_COLOR
            }
          }],
          yAxes: [{
            stacked: false,
            ticks: {
              min: 0,
              max: getYMax(data),
              fontColor: LIGHT_BLUE_COLOR
            },
            gridLines: {
              color: Y_GRID_COLOR
            },
            scaleLabel: {
              display: true,
              labelString: ylabel
            }
          }]
        },
        legend: {
          display: false,
          labels: {
            fontColor: LIGHT_BLUE_COLOR
          }
        },
        animation: {
          duration: 2000
        }
      }
    }
  }
  // the maximum Y should be 100 however when the user
  // go above 100 show untill 200 
  function getYMax(chartDataObject) {
    var rawDataArr = chartDataObject.datasets[0].data;
    if (rawDataArr[rawDataArr.length - 1] < 100 || rawDataArr.length == 0)
      return 100
    rawDataArr[rawDataArr.length - 1]
  }


  return {
    generateData: generateData,
    generateOptions: generateOptions
  };
})();