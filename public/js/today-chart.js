function runToday(entries) {
    var data = {};
    var elements = [];
    var colors = [];
    var borders = [];
    var prev = 0;
    var today = (new Date).getDate();
    for (var i = 0; i <= 23; i++) {
        var hourElements = generateElements(entries, i, today);
        if (hourElements.length > 1) {
            var element = hourElements[hourElements.length - 1];
            elements[i] = element + prev;
            prev = elements[i];
            colors[i] = Interpolate(element, 1);
            borders[i] = Interpolate(element, 0.5);
        }
    }
    if (typeof stat != "undefined") {
        var a = randomArray(23, 150);
        a.forEach(function(element, i) {
            if (typeof element != "undefined") {
                colors[i] = Interpolate(element, 1);
                borders[i] = Interpolate(element, 0.5);
            }
        });
        data = {
            labels: Array.apply(null, Array(24)).map(function(_, i) {
                return i;
            }),
            datasets: [{
                backgroundColor: colors,
                borderColor: borders,
                borderWidth: 2,
                data: a,
            }]
        };
    } else {
        data = {
            labels: Array.apply(null, Array((new Date()).getHours() + 1)).map(function(_, i) {
                return i;
            }),
            datasets: [{
                backgroundColor: colors,
                //borderColor: borders,
                borderWidth: 2,
                data: elements,
            }]
        };
    }
    Chart.defaults.global.defaultFontColor = '#7fa1b7';
    var myBarChart = new Chart(document.getElementById("today-chart"), {
        type: 'bar',
        data: data,
        options: {
            scales: {
                xAxes: [{
                    stacked: false,
                    gridLines: {
                        color: "rgba(0, 0, 0, 0)",
                        fontColor: "#7fa1b7"
                    },
                    scaleLabel: {
                    display: true,
                    labelString: 'Today Hours'
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
    runWeek(entries);
}

function randomArray(length, max) {
    return Array.apply(null, Array(length)).map(function() {
        return Math.round(Math.random() * max) + 1;
    });
}