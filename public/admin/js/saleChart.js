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

const inputTimeDice = document.querySelector('.fact-sale .list-time');
const inputLocationDice = document.querySelector('.fact-sale ul.list-location');
const inputProductDice = document.querySelector('.fact-sale ul.list-product');
const inputCustomerDice = document.querySelector('.fact-sale ul.list-customer')

let saleTimeChart = null
let saleForecastChart = null
let saleLocationChart = null
let saleProductChart = null
let saleCustomerChart = null
let saleCustomerChart2 = null

const saleTimeInputs = document.querySelectorAll('input[name="saleTime"]');
if (saleTimeInputs) {
  saleTimeInputs.forEach((input) => {
    input.addEventListener('change', function () {
      document.querySelectorAll('input[name="saleTime"]').forEach((el) => {
        el.nextElementSibling.classList.remove('active', 'bg-gray-500', 'text-white');
      });
      if (this.checked) {
        this.nextElementSibling.classList.add('active', 'bg-gray-500', 'text-white');
      }
    });
  });
}
const saleLocationInputs = document.querySelectorAll('input[name="saleLocation"]');
if (saleLocationInputs) {
  saleLocationInputs.forEach((input) => {
    input.addEventListener('change', function () {
      document.querySelectorAll('input[name="saleLocation"]').forEach((el) => {
        el.nextElementSibling.classList.remove('active', 'bg-gray-500', 'text-white');
      });
      if (this.checked) {
        this.nextElementSibling.classList.add('active', 'bg-gray-500', 'text-white');
      }
    });
  });
}
const saleProductInputs = document.querySelectorAll('input[name="saleProduct"]');
if (saleProductInputs) {
  saleProductInputs.forEach((input) => {
    input.addEventListener('change', function () {
      document.querySelectorAll('input[name="saleProduct"]').forEach((el) => {
        el.nextElementSibling.classList.remove('active', 'bg-gray-500', 'text-white');
      });
      if (this.checked) {
        this.nextElementSibling.classList.add('active', 'bg-gray-500', 'text-white');
      }
    });
  });
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

const forecastAPI = "http://localhost:5000/predict";
async function getForecastData(reqBody) {
  try {
    const data = await fetch(forecastAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reqBody)
    })
    const result = await data.json();
    return result.predictions;
  } catch (error) {
    console.log(error)
  }
}

let saleForecastData = []
async function renderSaleForecastChart() {
  if (saleForecastChart) {
    saleForecastChart.destroy();
  }

  let reqbody = ""
  if (currentTimeRollUp === "month") {
    reqbody = { month: true }
  } else if (currentTimeRollUp === "day") {
    reqbody = { day: 30 }
  }
  const data = await getForecastData(reqbody);
  saleForecastData = Object.values(data);
  let dataRange = []
  let dataMedian = []

  if (currentTimeRollUp === "month") {
    Object.keys(data).forEach(key => {
      dataRange.push({
        x: data[key].month,
        y: [data[key].yhat_lower, data[key].yhat_upper]
      })
      dataMedian.push({
        x: data[key].month,
        y: data[key].yhat
      })
    })
  } else if (currentTimeRollUp === "day") {
    data.forEach(item => {
      dataRange.push({
        x: Helper.formatDate(item.ds),
        y: [item.yhat_lower, item.yhat_upper]
      })
      dataMedian.push({
        x: Helper.formatDate(item.ds),
        y: item.yhat
      })
    })
  }


  let saleForecastChartOptions = {
    series: [
      {
        type: 'rangeArea',
        name: 'Revenue range',

        data: dataRange
      },
      {
        type: 'line',
        name: 'Revenue',
        data: dataMedian
      }
    ],
    chart: {
      height: 350,
      type: 'rangeArea',
      animations: {
        speed: 500
      }
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return Helper.formatLargeNumber(value)
        }
      }
    },
    colors: ['#d4526e', '#d4526e'],
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: [0.24, 1]
    },
    stroke: {
      curve: 'smooth',
      width: [0, 2]
    },
    legend: {
      show: true,
      customLegendItems: ['Revenue'],
      inverseOrder: true
    },
    title: {
      text: 'Sale Forecast Chart'
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
    }
  };

  saleForecastChart = new ApexCharts(
    document.querySelector(".fact-sale .sale-forecast"),
    saleForecastChartOptions);
  saleForecastChart.render();

}

let saleTimeData = []
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
  saleTimeData = [labels, data.Total_Quantity, data.Total_Revenue];

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

let saleLocationData = []
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
  saleLocationData = [labels, data.Total_Quantity, data.Total_Revenue];

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

let saleProductData = []
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
  saleProductData = [labels, data.Total_Quantity, data.Total_Revenue];

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

let saleCustomerData = []
async function renderSaleCustomerChart(rollUp = "type") {
  if (saleCustomerChart) {
    saleCustomerChart.destroy()
  }
  customer = rollUp
  const data = await getSaleData();

  saleCustomerData = [data.Type, data.Total_Revenue];
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

    saleForecastChart.updateOptions({
      series: []
    });
    if (item.value === 'year') {
      saleForecastChart.updateOptions({
        noData: {
          text: 'The annual revenue cannot be predicted.'
        }
      })
    } else {
      await renderSaleForecastChart()
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
  await renderSaleForecastChart()
  renderTimeDice()
  renderLocationDice()
  renderProductDice()
}
action()

// export PDF

const getChartImage = async (chart) => {
  return await chart.dataURI().then(({ imgURI }) => {
    return imgURI;
  });
};

async function layoutHTML(template) {
  if (template == 2) {
    const timeChartImage = await getChartImage(saleTimeChart)
    const locationChartImage = await getChartImage(saleLocationChart)
    const productChartImage = await getChartImage(saleProductChart)
    const customerChartImage = await getChartImage(saleCustomerChart)
    const saleForecastChartImage = await getChartImage(saleForecastChart)
    
    return `
      <div class="font-semibold">1. Doanh thu bán hàng và số lượng theo thời gian</div>
      <div class="flex justify-center w-[80%]">
        <img src="${timeChartImage}" alt="Time Chart">
      </div>
      <div class="font-semibold">2. Doanh thu bán hàng và số lượng theo khu vực</div>
      <div class="flex justify-center w-[80%]">
        <img src="${locationChartImage}" alt="Location Chart">
      </div>
      <div class="font-semibold">3. Doanh thu bán hàng và số lượng theo danh mục sản phẩm</div>
      <div class="flex justify-center w-[80%]">
        <img src="${productChartImage}" alt="Product Chart">
      </div>
      <div class="font-semibold">4. Doanh thu bán hàng và số lượng theo tệp khách hàng</div>
      <div class="flex justify-center w-[80%]">
        <img src="${customerChartImage}" alt="Customer Chart">
      </div>
      ${currentTimeRollUp !== "year" ? `
        <div class="font-semibold">5. Dự báo doanh thu</div>
        <div class="flex justify-center w-[80%]">
          <img src="${saleForecastChartImage}" alt="Sale Forecast Chart">
        </div>
      ` : ``}
    `
  } else {
    let saleTimeTable = `
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th class="border p-2 capitalize">${Helper.translate(currentTimeRollUp)}</th>
            <th class="border p-2 capitalize">Số lượng bán ra</th>
            <th class="border p-2 capitalize">Doanh thu</th>
          </tr>
        </thead>
        <tbody>
          ${saleTimeData[0].map((item, index) => {
            return `
              <tr>
                <td class="border p-2 text-center">${item}</td>
                <td class="border p-2 text-center">${saleTimeData[1][index]}</td>
                <td class="border p-2 text-center">${Helper.formatLargeNumber(saleTimeData[2][index])}</td>
              </tr>
            `
          }).join('')}
        </tbody>
      </table>
    `

    let saleLocationTable = `
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th class="border p-2 capitalize">${Helper.translate(currentLocationRollUp)}</th>
            <th class="border p-2 capitalize">Số lượng bán ra</th>
            <th class="border p-2 capitalize">Doanh thu</th>
          </tr>
        </thead>
        <tbody>
          ${saleLocationData[0].map((item, index) => {
            return `
              <tr>
                <td class="border p-2 text-center">${item}</td>
                <td class="border p-2 text-center">${saleLocationData[1][index]}</td>
                <td class="border p-2 text-center">${Helper.formatLargeNumber(saleLocationData[2][index])}</td>
              </tr>
            `
          }).join('')}
        </tbody>
      </table>
    `

    let saleProductTable = `
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th class="border p-2 capitalize">${Helper.translate(currentProductRollUp)}</th>
            <th class="border p-2 capitalize">Số lượng bán ra</th>
            <th class="border p-2 capitalize">Doanh thu</th>
          </tr>
        </thead>
        <tbody>
          ${saleProductData[0].map((item, index) => {
            return `
              <tr>
                <td class="border p-2 text-center">${item}</td>
                <td class="border p-2 text-center">${saleProductData[1][index]}</td>
                <td class="border p-2 text-center">${Helper.formatLargeNumber(saleProductData[2][index])}</td>
              </tr>
            `
          }).join('')}
        </tbody>
      </table>
    `

    let saleCustomerTable = `
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th class="border p-2 capitalize">Mạng xã hội</th>
            <th class="border p-2 capitalize">Doanh thu</th>
          </tr>
        </thead>
        <tbody>
          ${saleCustomerData[0].map((item, index) => {
            return `
              <tr>
                <td class="border p-2 text-center">${item}</td>
                <td class="border p-2 text-center">${Helper.formatLargeNumber(saleCustomerData[1][index])}</td>
              </tr>
            `
          }).join('')}
        </tbody>
      </table>
    `

    let saleForecastTable = `
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th class="border p-2 capitalize">${Helper.translate(currentTimeRollUp)}</th>
            <th class="border p-2 capitalize">Bi quan nhất</th>
            <th class="border p-2 capitalize">Lạc quan nhất</th>
            <th class="border p-2 capitalize">Khả năng cao nhất</th>
          </tr>
        </thead>
        <tbody>
          ${saleForecastData.map((item) => {
            let timeLabel = item[currentTimeRollUp];
            if (currentTimeRollUp === "day") {
              timeLabel = Helper.formatDate(item.ds);
            }
            return `
              <tr>
                <td class="border p-2 text-center">${timeLabel}</td>
                <td class="border p-2 text-center">${Helper.formatLargeNumber(item.yhat_lower)}</td>
                <td class="border p-2 text-center">${Helper.formatLargeNumber(item.yhat_upper)}</td>
                <td class="border p-2 text-center">${Helper.formatLargeNumber(item.yhat)}</td>
              </tr>
            `
          }).join('')}
        </tbody>
      </table>
    `

    const result = `
      <div class="font-semibold">1. Doanh thu bán hàng và số lượng theo thời gian</div>
      <div class="flex justify-center w-[90%] mb-2">
        ${saleTimeTable}
      </div>
      <div class="font-semibold">2. Doanh thu bán hàng và số lượng theo khu vực</div>
      <div class="flex justify-center w-[90%] mb-2">
        ${saleLocationTable}
      </div>
      <div class="font-semibold">3. Doanh thu bán hàng và số lượng theo danh mục sản phẩm</div>
      <div class="flex justify-center w-[90%] mb-2">
        ${saleProductTable}
      </div>
      <div class="font-semibold">4. Doanh thu bán hàng và số lượng theo tệp khách hàng</div>
      <div class="flex justify-center w-[90%] mb-2">
        ${saleCustomerTable}
      </div>
      ${currentTimeRollUp !== "year" ? `
        <div class="font-semibold">5. Dự báo doanh thu</div>
        <div class="flex justify-center w-[90%] mb-2">
          ${saleForecastTable}
        </div>
      `: ``}
    `
    return result;
  }
}

const contentReportElement = document.querySelector('#content-report')

const toggleButton = document.querySelector('button[data-modal-target="pdf-modal"]')
toggleButton.addEventListener('click', async function () {
  contentReportElement.innerHTML = await layoutHTML(1)
})

const templates = document.querySelectorAll('input[name="template"]')
templates.forEach(template => {
  template.addEventListener('change', async function () {
    
    contentReportElement.innerHTML = await layoutHTML(this.value)
  })
})

const downloadPDFBtn = document.querySelector('#download-pdf-btn')
const opt = {
  margin: [20, 30, 20, 20],
  filename: 'Sale Report.pdf',
  image: { type: 'jpeg', quality: 0.8 },
  html2canvas: {
    scale: 1.5,
    logging: false,
    useCORS: true,
    dpi: 96,
    letterRendering: true
  },
  jsPDF: {
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait',
    hotfixes: ['px_scaling'],
    putOnlyUsedFonts: true,
    compress: true
  },
  pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  onclone: function(clonedDoc) {
      clonedDoc.body.style.fontFamily = '"Times New Roman", Times, serif';
  }
}

downloadPDFBtn.addEventListener('click', function () {
  const preparePDF = document.querySelector('#export-content')
  html2pdf().set(opt).from(preparePDF).save()
})
