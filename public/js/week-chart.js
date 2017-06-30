function runWeek(entries) {
    var data = {};
    var elements = [];
    var colors = [];
    var borders = [];
    var curr = new Date; // get current date
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
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
            var minutesElements = generateElements(entries, i, j);
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
        colors[index] = Interpolate(dayElement, 1);
        borders[index] = Interpolate(dayElement, 0.5);
        index++;
    }
    console.log(elements);
    if (typeof stat != "undefined") {
        var a = randomArray(7, 160);
        a.forEach(function(element, i) {
            if (typeof element != "undefined") {
                var color = Interpolate(element, 1);
                colors[i] = color;
            }
        });
        console.log(a);
        console.log(colors);
        data = {
            labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            datasets: [{
                backgroundColor: colors,
                //borderColor: borders,
                borderWidth: 2,
                data: a,
            }]
        };
    } else {
        data = {
            labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            datasets: [{
                backgroundColor: colors,
                //borderColor: borders,
                borderWidth: 2,
                data: elements,
            }]
        };
    }
    Chart.defaults.global.defaultFontColor = '#7fa1b7';
    var myBarChart = new Chart(document.getElementById("week-chart"), {
        type: 'bar',
        data: data,
        options: {
            scales: {
                xAxes: [{
                    stacked: false,
                    gridLines: {
                        color: "rgba(0, 0, 0, 0)",
                        ticks: {
                            fontColor: "#7fa1b7"
                        }
                    },
                    scaleLabel: {
                    display: true,
                    labelString: 'Day of the week'
                  }
                }],
                yAxes: [{
                    stacked: false,
                    color: "#7fa1b7",
                    ticks: {
                        min: 0,
                        max: 200,
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
                    
                }
            },
            animation: {
                duration: 2000
            }
        }
    });
}

function checkElements(elements){
    console.log("hello")
    var value = elements.forEach(function(element){
        if(element > 100) {
            console.log(element);
            return element;
        }
    });
    if(value > 100){
        return value
    }
    return 100;
}