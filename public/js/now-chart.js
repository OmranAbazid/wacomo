var data = {};
console.log("Request started");
$.getJSON("http://wacomo2.azurewebsites.net/data", function(entries) {
    // console.log("request succeeded");
    // console.log(data);
    // var dataString = data.split("<")[0];
    // var entries = JSON.parse(dataString);
    console.log(entries);

    var elements = generateElements(entries, (new Date()).getHours(), (new Date()).getDate());
    data = {
        labels: Array.apply(null, Array((new Date()).getMinutes() + 1)).map(function(_, i) {
            return i;
        }),
        datasets: [{
            backgroundColor: Interpolate(elements[elements.length - 1], 0.3),
            borderWidth: 20,
            borderColor: Interpolate(elements[elements.length - 1], 0.5),
            pointBorderColor: "#fff",
            borderWidth: 5,
            pointBorderWidth: 2,
            data: elements,
        }]
    };
    Chart.defaults.global.defaultFontColor = '#7fa1b7';
    var myBarChart = new Chart(document.getElementById("now-chart"), {
        type: 'line',
        data: data,
        options: {
            scales: {
                xAxes: [{
                    stacked: false,
                    gridLines: {
                        color: "rgba(0, 0, 0, 0)",
                    },
                    scaleLabel: {
                    display: true,
                    labelString: 'Current Hour (min)'
                  }
                }],
                yAxes: [{
                    stacked: false,
                    ticks: {
                        min: 0,
                        max: elements[elements.length - 1] < 100 ? 100:elements[elements.length - 1],
                        fontColor: "#7fa1b7"
                    },
                    gridLines: {
                        color: "#0b3049"
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Consumpion %'
                    }

                }]
            },
            legend: {
                display: false,
                labels: {
                    fontColor: "#7fa1b7"
                }
            },
            animation: {
                duration: 2000
            }
        }
    });

    runToday(entries);
}).fail(function(jqXHR, textStatus, errorThrown) { alert('getJSON request failed! ' + textStatus); });

function Interpolate(count, opacity) {

    if (count <= 60) return "rgba(33, 135, 145," + opacity + ")";

    if (count > 60 && count <= 100) return "rgba(229, 217, 72, " + opacity + ")";

    if (count > 100) return "rgba(240, 78, 81, " + opacity + ")";
}

function generateElements(entries, hour, day){
    var elements = [];
    var cumulativeValue = 0;
    var duration = 0;
    entries.sort(function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(a.end_time) - new Date(b.end_time);
    });

    entries.forEach(function(element, i) {

        
        var endTime = new Date(element.end_time);
        var MS_PER_MINUTE = 60000;
        var startDate = new Date(endTime - element.duration);
        var startTime = new Date(startDate);
        var dayDate = new Date();

        dayDate.setDate(day);

        if (startDate.setHours(0, 0, 0, 0) == dayDate.setHours(0, 0, 0, 0)) {
            

            if (hour == startTime.getHours()) {
                duration = endTime.getMinutes() - startTime.getMinutes() + 1;
                stepSize = (element.level * duration - element.level) / (duration - 1);
                elements[startTime.getMinutes()] = cumulativeValue + element.level;
                cumulativeValue = elements[startTime.getMinutes()];
                var pointValue = 0;
                
                  for (var j = 1; j < duration; j++) {
                      elements[startTime.getMinutes() + j] = cumulativeValue + stepSize * j;
                  }
                
                cumulativeValue = elements[startTime.getMinutes() + (j-1)]; 

            }

        }

    });

    return elements;

}