const incomeFld = document.querySelector("#income");
const calcBtn = document.querySelector("#submit");
const outputFld = document.querySelector("#output");

const FedBrackets = [
    {
        min: 0,
        max: 48535,
        rate: .15
    },
    {
        min: 48535,
        max: 97069,
        rate: .205
    },
    {
        min: 97070,
        max: 150473,
        rate: .26
    },
    {
        min: 150474,
        max: 214368,
        rate: .29
    },
    {
        min: 214369,
        max: Infinity,
        rate: .33
    }
];
const OntBrackets = [
    {
        min: 0,
        max: 44740,
        rate: .0505
    },
    {
        min: 44741,
        max: 89482,
        rate: .0915
    },
    {
        min: 89483,
        max: 150000,
        rate: .1116
    },
    {
        min: 150001,
        max: 220000,
        rate: .1216
    },
    {
        min: 220001,
        max: Infinity,
        rate: .1316
    }
];

const thousands = [];

for (let i = 2; i < 28; i++) {
    thousands.push(5*(i+1));
}
const incomePoints = thousands.map(a => a * 1000);
const labels = thousands.map(a => a.toString() + 'k');
const fedTaxPoints = incomePoints.map(income => {
    let fedTaxes = 0;
    for (const bracket of FedBrackets) {
        if (income > bracket.min) {
            let amount;
            if (income > bracket.max) {
                amount = (bracket.max - bracket.min) * bracket.rate;
            } else {
                amount = (income - bracket.min) * bracket.rate;
            }
            fedTaxes += amount;
        }
    }
    return parseFloat(fedTaxes.toFixed(2));
});
const provTaxPoints = incomePoints.map(income => {
    let provTaxes = 0;
    for (const bracket of OntBrackets) {
        if (income > bracket.min) {
            let amount;
            if (income > bracket.max) {
                amount = (bracket.max - bracket.min) * bracket.rate;
            } else {
                amount = (income - bracket.min) * bracket.rate;
            }
            provTaxes += amount;
        }
    }
    return parseFloat(provTaxes.toFixed(2));
});
const remainingIncomePoints = incomePoints.map((income, index) => {
    return parseInt((incomePoints[index] - fedTaxPoints[index] - provTaxPoints[index]).toFixed(2));
});

var ctx = document.getElementById('taxChart').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
        labels: labels,
        datasets: [{
            label: 'After Taxes',
            backgroundColor: 'rgb(86, 153, 204)',
            data: remainingIncomePoints
        },
        {
            label: 'Federal Taxes',
            backgroundColor: 'rgb(204, 86, 86)',
            data: fedTaxPoints
        },
        {
            label: 'Provincial Taxes',
            backgroundColor: 'rgb(86, 204, 147)',
            data: provTaxPoints
        },]
    },

    // Configuration options go here
    options: {
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Gross Income (Pre-Tax)'
                },
                stacked: true,
            }],
            yAxes: [{
                stacked: true,
                ticks: {
                    callback: function(value) {
                        return parseInt(value/1000) + 'k'
                    }
                }
            }]
        },
        tooltips: {
            callbacks: {
                label: function(tooltipItem, data) {
                    var label = data.datasets[tooltipItem.datasetIndex].label || '';

                    if (label) {
                        label += ': $';
                    }
                    label += Math.round(tooltipItem.yLabel * 100) / 100;
                    return label;
                }
            }
        }
    }
});


calcBtn.addEventListener("click", calculate);

function calculate() {
    clearOutput();
    let income = incomeFld.value.replace(/\D+/g, "");
    if (income === '') {
        print('Please enter a valid income.')
        return;
    }

    let fedTaxes = fed(income);
    print("");
    let provTaxes = prov(income);
    print("");
    print("Total Taxes ------------ " + (fedTaxes + provTaxes).toFixed(2).toString());
    print("Average Tax Rate ------- " + ((fedTaxes + provTaxes)/income * 100).toFixed(2).toString() + '%');
    print("Remaining Income ------- " + (income - fedTaxes - provTaxes).toFixed(2).toString());

}

function fed(income) {
    let fedTaxes = 0;

    print(" ~~~ Federal Taxes ~~~");
    for (const bracket of FedBrackets) {
        let toPrint = (bracket.rate * 100).toFixed(2).toString() + "% - ";
        if (income > bracket.min) {
            let amount;
            if (income > bracket.max) {
                amount = (bracket.max - bracket.min) * bracket.rate;
            } else {
                amount = (income - bracket.min) * bracket.rate;
            }
            toPrint += amount.toFixed(2).toString();
            fedTaxes += amount;
        }

        print(toPrint);
    }
    print('Total Federal ---------- ' + fedTaxes.toFixed(2).toString());
    return fedTaxes;
}

function prov(income) {
    let provTaxes = 0;

    print(" ~~~ Ontario Taxes ~~~");
    for (const bracket of OntBrackets) {
        let toPrint = (bracket.rate * 100).toFixed(2).toString() + "% - ";
        if (income > bracket.min) {
            let amount;
            if (income > bracket.max) {
                amount = (bracket.max - bracket.min) * bracket.rate;
            } else {
                amount = (income - bracket.min) * bracket.rate;
            }
            toPrint += amount.toFixed(2).toString();
            provTaxes += amount;
        }

        print(toPrint);
    }
    print('Total Provincial ------- ' + provTaxes.toFixed(2).toString());
    return provTaxes;
}

function print(string) {
    outputFld.innerText += string + '\n';
}

function clearOutput() {
    outputFld.innerText = '';
}