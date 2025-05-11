let currentTimeRollUp = "month"
let currentLocationRollUp = "province"
let currentProductRollUp = "category"

let timeRollUp = ""
let timeDice = "";
let productRollUp = "";
let productDice = "";
let locationRollUp = "";
let locationDice = "";
let customer = "";
let customerDice = "";
let sort = "";

const timeInputRadios = document.querySelectorAll('input[name="saleTime"]')
const locationInputRadios = document.querySelectorAll('input[name="saleLocation"]')
const productInputRadios = document.querySelectorAll('input[name="saleProduct"]')
const customerInputRadios = document.querySelectorAll('input[name="saleCustomer"]')

const inputTimeDice = document.querySelector('.fact-sale .options .list-time');
const inputLocationDice = document.querySelector('.fact-sale .options ul.list-location');
const inputProductDice = document.querySelector('.fact-sale .options ul.list-product');
const inputCustomerDice = document.querySelector('.fact-sale .options ul.list-customer')

let saleTimeChart = null
let saleLocationChart = null
let saleProductChart = null
let saleCustomerChart = null
let saleCustomerChart2 = null

const saleAPI = "/api/dashboard/olap/fact_sale";

async function getSaleData() {
  try {
    const res = await fetch(saleAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        timeRollUp: timeRollUp,
        timeDice: timeDice,
        productRollUp: productRollUp,
        productDice: productDice,
        locationRollUp: locationRollUp,
        locationDice: locationDice,
        customer: customer,
        customerDice: customerDice,
        sort: sort
      })
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
    colors: ['#66C7F4', '#7E3AF2'],
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
      width: 5,
      curve: 'smooth'
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
          formatter: function (value) {
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
  sort = {
    key: "Total_Revenue",
    value: "desc"
  }

  let data = await getSaleData();
  let numberOfRecords = 15;
  data = {
    Total_Quantity: data.Total_Quantity.slice(-numberOfRecords),
    Total_Revenue: data.Total_Revenue.slice(-numberOfRecords),
    province: data.province.slice(-numberOfRecords),
    district: data.district?.slice(-numberOfRecords) || [],
    commune: data.commune?.slice(-numberOfRecords) || []
  }
  numberOfRecords = Math.min(numberOfRecords, data.Total_Quantity.length)
  let labels = [];
  for (let i = 0; i < numberOfRecords; i++) {
    let label = Helper.capitalize(data.province[i]);
    if (locationRollUp === "district") {
      label = Helper.capitalize(data.district[i]) + "-" + label;
    } else if (locationRollUp === "commune") {
      label = Helper.capitalize(data.commune[i]) + "-" + Helper.capitalize(data.district[i]) + "-" + label;
    }
    labels.push(label);
  }

  const saleLocationChartOptions = {
    series: [{
      data: data.Total_Revenue,
      name: "Revenue"
    }],
    chart: {
      type: 'bar',
      height: Helper.calculateChartHeight(numberOfRecords, 'bar', true),
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
        formatter: function (value) {
          return Helper.formatLargeNumber(value)
        }
      }
    }
  };

  saleLocationChart = new ApexCharts(document.querySelector(".fact-sale .location-chart"), saleLocationChartOptions);
  saleLocationChart.render();

  locationRollUp = ""
  sort = ""
  locationDiceValue = labels
}

async function renderSaleProductChart(rollUp = "category") {
  if (saleProductChart) {
    saleProductChart.destroy()
  }
  productRollUp = rollUp;
  sort = {
    key: "Total_Quantity",
    value: "asc"
  }
  let data = await getSaleData()
  const numberOfRecords = data.Total_Revenue.length
  let labels = []
  productDiceValue = []
  for (let i = 0; i < numberOfRecords; i++) {
    let label = "";
    if (productRollUp === "product") {
      label = data.product_name[i];
      productDiceValue.push({
        product_key: data.product_key[i],
        product_name: data.product_name[i]
      })
    } else {
      label = data.category_name[i],
        productDiceValue.push({
          category_key: data.category_key[i],
          category_name: data.category_name[i]
        })
    }
    labels.push(label)
  }

  const saleProductChartOptions = {
    series: [{
      name: 'Quantity',
      type: 'column',
      data: data.Total_Quantity
    },
    {
      name: 'Revenue',
      type: 'column',
      data: data.Total_Revenue
    }],
    chart: {
      height: 350,
      type: 'line',
      stacked: false
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: [1, 4, 4]
    },
    // title: {
    //   text: 'XYZ - Stock Analysis (2009 - 2016)',
    //   align: 'left',
    //   offsetX: 110
    // },
    xaxis: {
      categories: labels,
      labels: {
        trim: true,
        maxHeight: 100,
        style: {
          textOverflow: 'ellipsis'
        }
      }
    },
    yaxis: [
      {
        seriesName: 'Quantity',
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: '#008FFB'
        },
        labels: {
          style: {
            colors: '#008FFB',
          }
        },
        title: {
          text: "Quantity",
          style: {
            color: '#008FFB',
          }
        },
        tooltip: {
          enabled: true
        }
      },
      {
        seriesName: 'Revenue',
        opposite: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: '#00E396'
        },
        labels: {
          style: {
            colors: '#00E396',
          },
          formatter: function (value) {
            return Helper.formatLargeNumber(value)
          }
        },
        title: {
          text: "Revenue",
          style: {
            color: '#00E396',
          }
        }
      },
    ],
    tooltip: {
      fixed: {
        enabled: true,
        position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
        offsetY: 30,
        offsetX: 60
      },
    },
    legend: {
      horizontalAlign: 'left',
      offsetX: 40
    }
  };

  saleProductChart = new ApexCharts(document.querySelector(".fact-sale .product-chart"), saleProductChartOptions);
  saleProductChart.render();

  productRollUp = ""
  sort = ""
}

async function renderSaleCustomerChart(rollUp = "type") {
  if (saleCustomerChart) {
    saleCustomerChart.destroy()
  }
  customer = rollUp
  const data = await getSaleData();

  var saleCustomerChartOptions = {
    series: data.Total_Revenue,
    chart: {
      width: 380,
      type: 'pie',
    },
    labels: data.Type,
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  saleCustomerChart = new ApexCharts(document.querySelector(`.fact-sale .customer-chart`), saleCustomerChartOptions);
  saleCustomerChart.render();
  customer = "";
}

async function renderSaleCustomerChart2(rollUp = "gender") {
  if (saleCustomerChart2) {
    saleCustomerChart2.destroy()
  }
  customer = rollUp
  const data = await getSaleData(); 

  const saleCustomerChartOptions = {
    series: data.Total_Revenue,
    chart: {
      width: 380,
      type: 'pie',
    },
    labels: data.Gender.map(item => Helper.capitalize(item)),
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  saleCustomerChart2 = new ApexCharts(document.querySelector(`.fact-sale .customer-chart2`), saleCustomerChartOptions);
  saleCustomerChart2.render();
  customer = "";
}

async function renderAllChart() {
  await renderSaleTimeChart(currentTimeRollUp)
  await renderSaleLocationChart(currentLocationRollUp)
  await renderSaleProductChart(currentProductRollUp)
  await renderSaleCustomerChart()
  await renderSaleCustomerChart2()
}

// OLAP
timeInputRadios.forEach(item => {
  item.addEventListener('change', async function () {
    currentTimeRollUp = item.value
    if (timeDice != "") {
      timeDice = ''
      await renderAllChart()
    } else {
      await renderSaleTimeChart(item.value)
    }
    renderTimeDice(item.value);
  })
})

locationInputRadios.forEach(item => {
  item.addEventListener('change', async function () {
    currentLocationRollUp = item.value
    if (locationDice != "") {
      locationDice = ''
      await renderAllChart()
    } else {
      await renderSaleLocationChart(item.value)
    }
    renderLocationDice()
  })
})

productInputRadios.forEach(item => {
  item.addEventListener('change', async function () {
    currentProductRollUp = item.value
    if (productDice != "") {
      productDice = ''
      await renderAllChart()
    } else {
      await renderSaleProductChart(item.value)
    }
    renderProductDice()
  })
})

const timeDiceForm = document.querySelector('.fact-sale .time-dice-form')
const locationDiceForm = document.querySelector('.fact-sale .location-dice-form')
const productDiceForm = document.querySelector('.fact-sale .product-dice-form')
const customerDiceForm = document.querySelector('.fact-sale .customer-dice-form')

timeDiceForm.addEventListener('submit', async function (e) {
  e.preventDefault()
  const data = e.target.elements;
  timeDice = {
    start: data.start.value,
    end: data.end.value
  }
  if (data.start.value == "" || data.end.value == "") timeDice = ""
  timeRollUp = currentTimeRollUp
  const temp = await getSaleData();
  timeRollUp = ""
  if (Object.keys(temp).length === 0) {
    alert("No data available for this time period. Please enter a different time range.")
    timeDice = "";
    data.start.value = ""
    data.end.value = ""
    return
  }
  await renderAllChart()
})

locationDiceForm.addEventListener('submit', async function (e) {
  e.preventDefault()
  const formData = new FormData(this)
  locationDice = formData.getAll('location')
  await renderAllChart()
})

productDiceForm.addEventListener('submit', async function (e) {
  e.preventDefault()
  const formData = new FormData(this)
  productDice = {
    type: currentProductRollUp,
    arr: formData.getAll('sale-product')
  }
  await renderAllChart()
})

customerDiceForm.addEventListener('submit', function (e) {
  e.preventDefault()
  const formData = new FormData(this)
  customerDice = {
    gender: formData.getAll('gender'),
    type: formData.getAll('type')
  }
  if (customerDice.gender.length === 0) customerDice.gender = ["male", "female", "other", "unknown"]
  if (customerDice.type.length === 0) customerDice.type = ["facebook", "google", "github", "normal"]

  console.log(customerDice)
  renderAllChart()
})
// END OLAP

function renderTimeDice(unit = "month") {
  let placeholder = "e.g: 2024";
  if (unit == "month") {
    placeholder = "e.g: 02-2024"
  } else if (unit == "day") {
    placeholder = "e.g: 01-02-2024"
  }
  inputTimeDice.innerHTML = ''
  inputTimeDice.innerHTML = `
    <div class="flex flex-col items-start">
      <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Start ${unit}</label>
      <div class="relative">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
            </svg>
        </div>
        <input name="start" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="${placeholder}">
      </div>
      <span class="mx-2 text-gray-500 dark:text-gray-400">to</span>
      <label for="title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">End ${unit}</label>
      <div class="relative">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
            </svg>
        </div>
        <input name="end" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="${placeholder}">
      </div>
    </div>
  `
}

var locationDiceValue = [];
function renderLocationDice() {
  inputLocationDice.innerHTML = ""
  locationDiceValue.forEach(item => {
    inputLocationDice.innerHTML += `
      <li>
        <div class="flex items-center ps-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-600">
          <label class="w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded-sm dark:text-gray-300">
            <input
              type="checkbox"
              name="location"
              value="${item.toLowerCase()}"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
            />
            <span>${item}</span>
          </label>
        </div>
      </li>
    `
  })
}

var productDiceValue = [];
function renderProductDice() {
  inputProductDice.innerHTML = ''
  productDiceValue.forEach(item => {
    inputProductDice.innerHTML += `
      <li>
        <div class="flex items-center ps-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-600">
          <label class="w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded-sm dark:text-gray-300">
            <input
              type="checkbox"
              name="sale-product"
              value="${item.category_key || item.product_key}"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
            />
            <span>${item.product_name || item.category_name}</span>
          </label>
        </div>
      </li>
    `
  })
}

async function action() {
  await renderAllChart()
  renderTimeDice()
  renderLocationDice()
  renderProductDice()
}
action()