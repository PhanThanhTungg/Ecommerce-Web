let timeRollUp = "year"
let timeSlice = "";
let timeDice = {
  start: "",
  end: ""
}
let productRollUp = "all"
let productSlice = "";
let productDice = []
let locationRollUp = "province"
let locationSlice = "";
let locationDice = {
  type: "",
  data: []
}

const saleAPI = "/api/dashboard/olap/fact_sale";

async function getSaleData() {
  try {
    const res = await fetch(saleAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "timeRollUp": "day"
      })
    })
    const result = await res.json();
    console.log(result.data);
  } catch (error) {
    console.log(error)
  }
  
}
getSaleData()

var optionsSaleTimeChart = {
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
      name: 'Column A',
      type: 'column',
      data: [21.1, 23, 33.1, 34, 44.1, 44.9, 56.5, 58.5]
    },
    {
      name: "Line C",
      type: 'line',
      data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6]
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
    categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016]
  },
  yaxis: [
    {
      seriesName: 'Quantity',
      axisTicks: {
        show: true
      },
      axisBorder: {
        show: true,
      },
      title: {
        text: "Quantity"
      }
    },
    {
      seriesName: 'Column A',
      show: false
    }, {
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
      }
    }
  ],
  tooltip: {
    shared: false,
    intersect: true,
    x: {
      show: false
    }
  },
  legend: {
    horizontalAlign: "left",
    offsetX: 40
  }
};

let saleTimeChart = new ApexCharts(document.querySelector(".fact-sale .time-chart"), optionsSaleTimeChart);
saleTimeChart.render()