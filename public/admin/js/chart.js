let timeRollUp = ""
let timeSlice = "";
let timeDice = "";
let productRollUp = ""
let productSlice = "";
let productDice = ""
let locationRollUp = ""
let locationSlice = "";
let locationDice = ""
let customer = "";

const timeInputRadios = document.querySelectorAll('input[name="saleTime"]')
const locationInputRadios = document.querySelectorAll('input[name="saleLocation"]')
const productInputRadios = document.querySelectorAll('input[name="saleProduct"]')
const customerInputRadios = document.querySelectorAll('input[name="saleCustomer"]')

let saleTimeChart = null
let saleLocationChart = null
let saleProductChart = null
let saleCustomerChart = null

const saleAPI = "/api/dashboard/olap/fact_sale";

async function getSaleData() {
  try {
    const res = await fetch(saleAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: `{
        "timeRollUp":"${timeRollUp}",
        "timeSlice":"${timeSlice}",
        "timeDice":"${timeDice}",
        "productRollUp":"${productRollUp}",
        "productSlice":"${productSlice}",
        "productDice":"${productDice}",
        "locationRollUp":"${locationRollUp}",
        "locationSlice":"${locationSlice}",
        "locationDice":"${locationDice}",
        "customer":"${customer}"
      }`
    })
    const result = await res.json();
    return result.data;
  } catch (error) {
    console.log(error)
  }

}

async function renderSaleTimeChart(rollUp = "month") {
  if (saleTimeChart) {
    saleTimeChart.destroy();
  }
  timeRollUp = rollUp
  const data = await getSaleData();

  const numberOfRecords = data.Total_Revenue.length;
  let labels = []
  for (let i = 0; i < numberOfRecords; i++) {
    let label = data.year[i];
    if (timeRollUp === "day") {
      label = data.day[i] + "-" + data.month[i] + "-" + label;
    } else if (timeRollUp === "month") {
      label = data.month[i] + "-" + label
    }
    labels.push(label)    
  }

  const optionsSaleTimeChart = {
    chart: {
      height: 350,
      type: "line",
      stacked: false
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#99C2A2', '#C5EDAC', '#66C7F4'],
    series: [
      {
        name: 'Product quantity',
        type: 'column',
        data: data.Total_Quantity
      },
      {
        name: 'Revenue',
        type: 'line',
        data: data.Total_Revenue
      },
    ],
    stroke: {
      width: [4, 4, 4]
    },
    plotOptions: {
      bar: {
        columnWidth: "20%"
      }
    },
    xaxis: {
      categories: labels,
      tickAmount: 20,

    },
    yaxis: [
      {
        seriesName: 'Product quantity',
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: true,
        },
        title: {
          text: "Product quantity"
        },
      },
      {
        opposite: true,
        seriesName: 'Revenue',
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: true,
        },
        title: {
          text: "Revenue"
        },
        labels: {
          formatter: function(value) {
            return Helper.formatLargeNumber(value)
          }
        }
      }
    ],
    tooltip: {
      shared: true,
      intersect: false,
      x: {
        show: false
      }
    },
    legend: {
      horizontalAlign: "left",
      offsetX: 40
    }
  };

  saleTimeChart = new ApexCharts(document.querySelector(".fact-sale .time-chart"), optionsSaleTimeChart);
  saleTimeChart.render()
  timeRollUp = "";
}

async function renderSaleLocationChart(rollUp = "province") {
  if (saleLocationChart) {
    saleLocationChart.destroy();
  }
  locationRollUp = rollUp;
  console.log(locationRollUp, timeRollUp)
  const data = await getSaleData();
  console.log(data)
  const numberOfRecords = data.Total_Revenue.length;
  let labels = []
  for (let i = 0; i < numberOfRecords; i++) {
    let label = Helper.capitalize(data.province[i])
    if (locationRollUp === "district") {
      label = Helper.capitalize(data.district[i])
    } else if (locationRollUp === "commune") {
      label = Helper.capitalize(data.commune[i])
    }
    labels.push(label)
  }

  let saleLocationChartOptions = {
    series: [{
      data: data.Total_Revenue
    }],
    chart: {
      type: 'bar',
      height: 600,
      toolbar: Helper.getChartToolbarOptions(),
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: true,
        
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: 'end',
        horizontal: true,
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: labels,
      labels: {
        formatter: function(value) {
          return Helper.formatLargeNumber(value)
        }
      }
    }
  };

  saleLocationChart = new ApexCharts(document.querySelector(".fact-sale .location-chart"), saleLocationChartOptions);
  saleLocationChart.render();
  locationRollUp = ""
}

async function renderAllChart() {
  await renderSaleTimeChart()
  await renderSaleLocationChart()
}
renderAllChart()

timeInputRadios.forEach(item => {
  item.addEventListener('change', function() {
    renderSaleTimeChart(item.value)
  })
})
locationInputRadios.forEach(item => {
  item.addEventListener('change', function() {
    renderSaleLocationChart(item.value)
  })
})