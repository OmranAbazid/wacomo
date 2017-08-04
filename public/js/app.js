var app = (function() {
  // glabal Variables

  // entries by the get request to the API
  var dataPoints = [];
  var API_URL = "http://wacomo2.azurewebsites.net/data";



  // filter the entries to get elements of a specific day and specific hour
  function getHourElements(entries, hour, day) {
    var elements = [];
    var cumulativeValue = 0;
    var duration = 0;

    // sort data
    entries.sort(function(a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(a.end_time) - new Date(b.end_time);
    });

    // loop through the entries
    entries.forEach(function(element, i) {
      var endTime = new Date(element.end_time);
      var startDate = new Date(endTime - element.duration);
      var startTime = new Date(startDate);
      var dayDate = new Date();
      dayDate.setDate(day);
      // check the day first
      if (startDate.setHours(0, 0, 0, 0) == dayDate.setHours(0, 0, 0, 0)) {
        // check the hour
        if (hour == startTime.getHours()) {
          // calculate the duration of the consumption
          duration = endTime.getMinutes() - startTime.getMinutes() + 1;

          for (var j = 0; j < duration; j++) {
            elements[startTime.getMinutes() + j] = cumulativeValue + level;
            cumulativeValue = elements[startTime.getMinutes() + j];
          }
        }
      }
    });

    return elements;
  }

  // XHR getjson to get rid of jquery
  function getJSON(url, callback) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);

    request.onreadystatechange = function() {
      if (this.readyState === 4) {
        if (this.status >= 200 && this.status < 400) {
          // Success!
          var data = JSON.parse(this.responseText);
          return callback(data);
        } else {
          return console.log("error in the request");
        }
      }
    };

    request.send();
    request = null;
  }

  /**
   *
   * generate the current hour chart (NOW) on the /device page
   *
   */
  function runNowChart() {
    var hourElements = [];
    var currentDate = new Date();
    var currentHour = currentDate.getHours();
    var currentDay = currentDate.getDate();
    getJSON(API_URL, function(entries) {
      dataPoints = entries;
      // get the current hour element from the api
      hourElements = getHourElements(dataPoints, currentHour, currentDay);
      // generate the chart js data object
      var data = ChartConfig.generateData(hourElements, "min");
      var xlabel = "Current Hour (min)";
      var ylabel = "Consumpion %";
      var options = ChartConfig.generateOptions("line", data, xlabel, ylabel);
      new Chart(document.getElementById("now-chart"), options);
    });
  }

  /**
   *
   * generate the hourly graph on the /:device page
   *
   */
  function runHourChart() {
    var data = {};
    var elements = [];
    var colors = [];
    var borders = [];
    var prev = 0;
    var today = (new Date).getDate();
    for (var i = 0; i <= 23; i++) {
      var hourElements = getHourElements(dataPoints, i, today);
      if (hourElements.length > 1) {
        var element = hourElements[hourElements.length - 1];
        elements[i] = element + prev;
        prev = elements[i];
      }
    }
    var data = ChartConfig.generateData(elements, "hour");
    var xlabel = "Current Day (Hours)";
    var ylabel = "Consumpion %";
    var options = ChartConfig.generateOptions("bar", data, xlabel, ylabel);
    new Chart(document.getElementById("today-chart"), options);
  }
  
  /**
   *
   * generate the week graph on the /:device page
   *
   */
  function runWeekChart() {
    var data = {};
    var elements = [];
    var colors = [];
    var borders = [];
    // get current date
    var curr = new Date;
    // First day is the day of the month - the day of the week
    var first = curr.getDate() - curr.getDay();
    var last = first + 6; // last day is the first day + 6
    var firstday = new Date(curr.setDate(first));
    var lastday = new Date(curr.setDate(last));
    var hourElement = 0;
    var prev = 0;
    var index = 0;
    for (var j = firstday.getDate(); j <= lastday.getDate(); j++) {
      prev = 0;
      var hourElements = [];
      for (var i = 0; i <= 23; i++) {
        var minutesElements = getHourElements(dataPoints, i, j);
        if (minutesElements.length >= 1) {
          console.log("Day", j);
          console.log("Hour", i);
          console.log(minutesElements[minutesElements.length - 1]);
          hourElement = minutesElements[minutesElements.length - 1] + prev;
          prev = hourElement;
          hourElements.push(hourElement);
        }
      }
      var dayElement = 0
      if (hourElements.length >= 1) {
        dayElement = hourElements[hourElements.length - 1];
      }
      elements[index] = dayElement;
      index++;
    }
    var data = ChartConfig.generateData(elements, "week");
    var xlabel = "Current week (Days)";
    var ylabel = "Consumpion %";
    var options = ChartConfig.generateOptions("bar", data, xlabel, ylabel);
    new Chart(document.getElementById("week-chart"), options);
  }


  /*=============================================
          =            run app            =
  =============================================*/
  
  
  function init(){
    runNowChart();
    runHourChart();
    runWeekChart();
  }

  init();


})();