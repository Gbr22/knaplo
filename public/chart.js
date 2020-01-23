
function avgChartUpdate(){}


{
    var ctx = document.getElementById('avg_chart').getContext('2d');
    
    let grades = [];
    let avgs = [];
    
    function getAvg(index){
        let sum = 0;
        let count = index+1;
        for (let i=0; i < index+1; i++){
            sum += grades[i];
        }
        return sum/count;
    }

    function clear(arr){
        arr.splice(0,arr.length);
    }

    
    
    let gridLines = {
        color: getComputedStyle(document.documentElement)
            .getPropertyValue('--divider-color'),
    }
    var chart = new Chart(ctx, {
        type: 'line',
        
        data: {

            labels: grades,
            datasets: [
                {
                    label: 'Átlag',
                    data: avgs,
                    backgroundColor: 'rgba(0, 204, 0, 0.2)',
                    borderColor: '#00cc00',
                    borderWidth: 1
                },
                {
                    label: 'Jegy',
                    data: grades,
                    backgroundColor: 'rgba(51, 153, 255, 0.2)',
                    showLine:false,
                    borderColor: '#3399ff',
                    borderWidth: 1
                }    
            ]
        },
        options: {
            responsive:true,
            maintainAspectRatio:false,
            legend:{
                display:true,
            },
            scales: {
                yAxes: [{
                    ticks: {
                        max: 5,
                        min: 0,
                        stepSize: 1,
                        beginAtZero: true
                    },
                    gridLines
                }],
                xAxes: [{
                    gridLines: {
                        color: "rgba(0, 0, 0, 0)",
                    }
                }],
            }
        }
    });

    avgChartUpdate = function(arr){
        clear(grades);
        clear(avgs);
        grades.push(...arr);

        for (let i=0; i < grades.length; i++){
            avgs[i]=getAvg(i);
        }
        chart.update();
    }

}

avgChartUpdate([]);