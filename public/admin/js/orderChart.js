let timeRollUp = "month"
let locationRollUp = "province"
let orderRollUp = "delivery"
let customerRollUp = "type"

let timeDice = ''
let locationDice = ''
let orderDice = ''
let customerDice = ''

let timeDiceValue = []
let locationDiceValue = []
let orderDiceValue = []
let customerDiceValue = []

let timeChart = null
let locationChart = null
let orderChart = null
let customerChart = null

const inputTimeRadios = document.querySelectorAll('input[name="orderTime"]')
const inputLocationRadios = document.querySelectorAll('input[name="orderLocation"]')
const inputOrderRadios = document.querySelectorAll('input[name="orderOrder"]')
const inputCustomerRadios = document.querySelectorAll('input[name="orderCustomer"]')

const inputTimeDice = document.querySelector('.fact-order .list-time')
const inputLocationDice = document.querySelector('.fact-order .list-location')
const inputOrderDice = document.querySelector('.fact-order .list-order')
const inputCustomerDice = document.querySelector('.fact-order .list-customer')

const timeDiceForm = document.querySelector('.fact-order .time-dice-form')
const locationDiceForm = document.querySelector('.fact-order .location-dice-form')
const orderDiceForm = document.querySelector('.fact-order .order-dice-form')
const customerDiceForm = document.querySelector('.fact-order .customer-dice-form')


const orderTimeInputs = document.querySelectorAll('input[name="orderTime"]');
if (orderTimeInputs) {
  orderTimeInputs.forEach((input) => {
    input.addEventListener('change', function () {
      document.querySelectorAll('input[name="orderTime"]').forEach((el) => {
        el.nextElementSibling.classList.remove('active', 'bg-gray-500', 'text-white');
      });
      if (this.checked) {
        this.nextElementSibling.classList.add('active', 'bg-gray-500', 'text-white');
      }
    });
  });
}

const orderLocationInputs = document.querySelectorAll('input[name="orderLocation"]');
if (orderLocationInputs) {
  orderLocationInputs.forEach((input) => {
    input.addEventListener('change', function () {
      document.querySelectorAll('input[name="orderLocation"]').forEach((el) => {
        el.nextElementSibling.classList.remove('active', 'bg-gray-500', 'text-white');
      });
      if (this.checked) {
        this.nextElementSibling.classList.add('active', 'bg-gray-500', 'text-white');
      }
    });
  });
}

const orderOrderInputs = document.querySelectorAll('input[name="orderOrder"]');
if (orderOrderInputs) {
  orderOrderInputs.forEach((input) => {
    input.addEventListener('change', function () {
      document.querySelectorAll('input[name="orderOrder"]').forEach((el) => {
        el.nextElementSibling.classList.remove('active', 'bg-gray-500', 'text-white');
      });
      if (this.checked) {
        this.nextElementSibling.classList.add('active', 'bg-gray-500', 'text-white');
      }
    });
  });
}
const orderCustomerInputs = document.querySelectorAll('input[name="orderCustomer"]');
if (orderCustomerInputs) {
  orderCustomerInputs.forEach((input) => {
    input.addEventListener('change', function () {
      document.querySelectorAll('input[name="orderCustomer"]').forEach((el) => {
        el.nextElementSibling.classList.remove('active', 'bg-gray-500', 'text-white');
      });
      if (this.checked) {
        this.nextElementSibling.classList.add('active', 'bg-gray-500', 'text-white');
      }
    });
  });
}

const orderAPI = "/api/dashboard/olap/fact_order"

async function getOrderData(reqBody) {
  try {
    const res = await fetch(orderAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reqBody)
    })
    const data = await res.json()
    return data.data
  } catch (error) {
    console.error("Error fetching order data:", error)
  }
}

let orderTimeData = []
let orderLocationData = []
let orderOrderData = []
let orderCustomerData = []

async function renderTimeChart() {
  if (timeChart) {
    timeChart.destroy()
  }
  const reqBody = {
    timeRollUp: timeRollUp,
    timeDice: timeDice,
    locationDice: locationDice,
    orderDice: orderDice,
    customerDice: customerDice
  }

  let orderTimeChartOptions = {
    series: [],
    chart: {
      height: 260,
      type: 'line',
      stacked: true,
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true,
      },
      toolbar: {
        autoSelected: 'zoom',
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0,
    },
    stroke: {
      width: 5,
      curve: "monotoneCubic"
    },
    noData: {
      text: 'Loading...'
    },
    yaxis: {
      seriesName: 'Number of Order',
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
      tooltip: {
        enabled: true
      }
    },
    legend: {
      position: 'left',
      offsetY: 20
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
    }
  }

  timeChart = new ApexCharts(
    document.querySelector('.fact-order .time-chart'),
    orderTimeChartOptions
  )
  timeChart.render()

  const data = await getOrderData(reqBody)
  let dataLabels = []
  const numberOfRows = data.Total_Order.length || 0
  for (let i = 0; i < numberOfRows; i++) {
    let label = data.year[i]
    if (timeRollUp === "month") {
      label = data.month[i] + "-" + label
    } else if (timeRollUp === "day") {
      label = data.day[i] + "-" + data.month[i] + "-" + label
    }
    dataLabels.push(label)
  }
  orderTimeData = [dataLabels, data.Total_Order]
  
  timeChart.updateOptions({
    xaxis: {
      categories: dataLabels
    },
    series: [{
      data: data.Total_Order,
      name: "Number of Order",
      color: '#008FFB'
    }]
  })
}

async function renderLocationChart() {
  if (locationChart) {
    locationChart.destroy()
  }
  const reqBody = {
    locationRollUp: locationRollUp,
    locationDice: locationDice,
    timeDice: timeDice,
    orderDice: orderDice,
    customerDice: customerDice,
    sort: "asc"
  }

  let orderLocationChartOptions = {
    series: [],
    chart: {
      height: 260,
      type: 'line',
      stacked: true,
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true,
      }
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0,
    },  
    stroke: {
      width: 5,
      curve: "monotoneCubic"
    },
    noData: {
      text: 'Loading...'
    },
    yaxis: {
      seriesName: 'Number of Order',
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
      tooltip: {
        enabled: true
      }
    },
    legend: {
      position: 'left',
      offsetY: 20
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
    }
  }

  locationChart = new ApexCharts(
    document.querySelector('.fact-order .location-chart'),
    orderLocationChartOptions
  )
  locationChart.render()

  const data = await getOrderData(reqBody)
  locationDiceValue = []
  let dataLabels = []
  const numberOfRows = data.Total_Order.length
  for (let i = 0; i < numberOfRows; i++) {
    let label = Helper.capitalize(data.province[i])
    if (locationRollUp === "district") {
      label = Helper.capitalize(data.district[i]) + "-" + label
    } else if (locationRollUp === "commune") {
      label = Helper.capitalize(data.commune[i] + "-" + data.district[i]) + "-" + label
    }
    dataLabels.push(label)
    locationDiceValue.push(label)
  }
  locationDiceValue.reverse()
  orderLocationData = [dataLabels, data.Total_Order]

  locationChart.updateOptions({
    xaxis: {
      categories: dataLabels,
      labels: {
        trim: true,
        maxHeight: 100,
        style: {
          textOverflow: 'ellipsis'
        }
      }
    },
    series: [{
      data: data.Total_Order,
      name: "Number of Order",
      color: '#008FFB',
      type: 'bar'
    }]
  })
}

async function renderOrderChart() {
  if (orderChart) {
    orderChart.destroy()
  }
  
  const reqBody = {
    orderRollUp: orderRollUp,
    orderDice: orderDice,
    timeDice: timeDice,
    locationDice: locationDice,
    customerDice: customerDice
  }

  const data = await getOrderData(reqBody)
  if (orderRollUp === "payment") {
    orderOrderData = [data.Payment_method, data.Total_Order]
  } else {
    orderOrderData = [data.Delivery_method, data.Total_Order]
  }
  let orderOrderChartOptions = {
    series: data.Total_Order,
    chart: {
      width: 380,
      type: 'pie',
    },
    labels: data.Delivery_method?.map(item => Helper.capitalize(item)) || data.Payment_method.map(item => Helper.capitalize(item)),
    noData: {
      text: 'Error order chart'
    },
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

  orderChart = new ApexCharts(
    document.querySelector('.fact-order .order-chart'),
    orderOrderChartOptions
  )
  orderChart.render()

  if (orderRollUp === "delivery") {
    orderDiceValue = data.Delivery_method
  } else if (orderRollUp === "payment") {
    orderDiceValue = data.Payment_method
  }
}

async function renderCustomerChart() {
  if (customerChart) {
    customerChart.destroy()
  }
  const reqBody = {
    customer: customerRollUp,
    customerDice: customerDice,
    timeDice: timeDice,
    locationDice: locationDice,
    orderDice: orderDice
  }

  const data = await getOrderData(reqBody)
  orderCustomerData = [data.Type || data.Gender, data.Total_Order]
  let orderCustomerChartOptions = {
    series: data.Total_Order,
    chart: {
      width: 380,
      type: 'pie',
    },
    labels: data.Type?.map(item => Helper.capitalize(item)) || data.Gender.map(item => Helper.capitalize(item)),
    noData: {
      text: 'Error order chart'
    },
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

  customerChart = new ApexCharts(
    document.querySelector('.fact-order .customer-chart'),
    orderCustomerChartOptions
  )
  customerChart.render()

  if (customerRollUp === "type") {
    customerDiceValue = data.Type
  } else if (customerRollUp === "gender") {
    customerDiceValue = data.Gender
  }
}

async function renderAllChart() {
  await renderTimeChart()
  await renderLocationChart()
  await renderOrderChart()
  await renderCustomerChart()
}

// Roll up
inputTimeRadios.forEach(radio => {
  radio.addEventListener('change', async () => {
    timeRollUp = radio.value
    if (timeDice != "") {
      timeDice = ''
      await renderAllChart()
    } else {
      await renderTimeChart()
    }
    renderTimeDice()
  })
})

inputLocationRadios.forEach(radio => {
  radio.addEventListener('change', async () => {
    locationRollUp = radio.value
    if (locationDice != "") {
      locationDice = ''
      await renderAllChart()
    } else {
      await renderLocationChart()
    }
    renderLocationDice()
  })
})

inputOrderRadios.forEach(radio => {
  radio.addEventListener('change', async () => {
    orderRollUp = radio.value
    if (orderDice != "") {
      orderDice = ''
      await renderAllChart()
    } else {
      await renderOrderChart()
    }
    renderOrderDice()
  })  
})

inputCustomerRadios.forEach(radio => {
  radio.addEventListener('change', async () => {
    customerRollUp = radio.value
    if (customerDice != "") {
      customerDice = ''
      await renderAllChart()
    } else {
      await renderCustomerChart()
    }
    renderCustomerDice()
  })
})
//End roll up

// Dice
function renderTimeDice() {
  let placeholder = "e.g: 2024";
  if (timeRollUp == "month") {
    placeholder = "e.g: 02-2024"
  } else if (timeRollUp == "day") {
    placeholder = "e.g: 01-02-2024"
  } else if (timeRollUp == "year") {
    placeholder = "e.g: 2024"
  }
  inputTimeDice.innerHTML = ''
  inputTimeDice.innerHTML = `
    <div class="flex flex-col items-start">
      <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Start ${timeRollUp}</label>
      <div class="relative">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
            </svg>
        </div>
        <input name="start" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="${placeholder}">
      </div>
      <span class="mx-2 text-gray-500 dark:text-gray-400">to</span>
      <label for="title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">End ${timeRollUp}</label>
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

function renderOrderDice() {
  inputOrderDice.innerHTML = ""
  orderDiceValue.forEach(item => {
    inputOrderDice.innerHTML += `
      <li>
        <div class="flex items-center ps-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-600">
          <label class="w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded-sm dark:text-gray-300">
            <input
              type="checkbox"
              name="${orderRollUp}"
              value="${item}"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
            />
            <span>${Helper.capitalize(item)}</span>
          </label>
        </div>
      </li>
    `
  })
}

function renderCustomerDice() {
  inputCustomerDice.innerHTML = ""
  customerDiceValue.forEach(item => {
    inputCustomerDice.innerHTML += `
      <li>
        <div class="flex items-center ps-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-600">
          <label class="w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded-sm dark:text-gray-300">
            <input
              type="checkbox"
              name="${customerRollUp}"
              value="${item.toLowerCase()}"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
            />
            <span>${Helper.capitalize(item)}</span>
          </label>
        </div>
      </li>
    `
  })
}

timeDiceForm.addEventListener('submit', async function (e) {
  e.preventDefault()
  const data = e.target.elements;
  timeDice = {
    start: data.start.value,
    end: data.end.value
  }
  if (data.start.value == "" || data.end.value == "") timeDice = ""
  const temp = await getOrderData({
    timeRollUp: timeRollUp,
    timeDice: timeDice,
    locationDice: locationDice,
    orderDice: orderDice,
    customerDice: customerDice,
  });

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

orderDiceForm.addEventListener('submit', async function (e) {
  e.preventDefault()
  const formData = new FormData(this)
  if (orderRollUp === "delivery") {
    orderDice = {
      type: "delivery",
      arr: formData.getAll('delivery')
    }
  } else if (orderRollUp === "payment") {
    orderDice = {
      type: "payment",
      arr: formData.getAll('payment')
    }
  }
  await renderAllChart()
})

customerDiceForm.addEventListener('submit', async function (e) {
  e.preventDefault()
  const formData = new FormData(this)
  if (customerRollUp === "type") {
    customerDice = {
      gender: ["male", "female", "other", "unknown"],
      type: formData.getAll('type')
    }
  } else if (customerRollUp === "gender") {
    customerDice = {
      gender: formData.getAll('gender'),
      type: ["facebook", "google", "github", "other"]
    }
  }
  await renderAllChart()
})


// End dice
async function action() {
  await renderAllChart()
  renderTimeDice()
  renderLocationDice()
  renderOrderDice()
  renderCustomerDice()
}

action()


function showAnimatedAlert(message, type = 'success', duration = 3000) {
  const alertDiv = document.createElement('div');
  alertDiv.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()" style="margin-left: 10px; background: none; border: none; color: white; cursor: pointer;">&times;</button>
  `;
  
  const colors = {
    success: '#4CAF50',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196F3'
  };
  
  alertDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: ${colors[type]};
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 9999;
    font-family: Arial, sans-serif;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  
  document.body.appendChild(alertDiv);
  
  // Animate in
  setTimeout(() => {
    alertDiv.style.transform = 'translateX(0)';
  }, 10);
  
  // Auto remove
  setTimeout(() => {
    alertDiv.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.parentNode.removeChild(alertDiv);
      }
    }, 300);
  }, duration);
}

socket.on("dwhDataUpdated", (data)=>{
  if(data.message == "successfully"){
    action();
    console.log("update order chart successfully");
    showAnimatedAlert('ETL successfully - update chart successfully!', 'success');
  }
})

// export PDF
const getChartImage = async (chart) => {
  return await chart.dataURI().then(({ imgURI }) => {
    return imgURI;
  });
};

async function layoutHTML(template) {
  if (template == 2) {
    const timeChartImage = await getChartImage(timeChart)
    const locationChartImage = await getChartImage(locationChart)
    const orderChartImage = await getChartImage(orderChart)
    const customerChartImage = await getChartImage(customerChart)
    
    return `
      <div class="font-semibold">1. Số lượng đơn đặt hàng theo thời gian</div>
      <div class="flex justify-center w-[80%]">
        <img src="${timeChartImage}" alt="Time Chart">
      </div>
      <div class="font-semibold">2. Số lượng đơn đặt hàng theo khu vực</div>
      <div class="flex justify-center w-[80%]">
        <img src="${locationChartImage}" alt="Location Chart">
      </div>
      <div class="font-semibold">3. Số lượng đơn đặt hàng theo phương thức vận chuyển/thanh toán</div>
      <div class="flex justify-center w-[80%]">
        <img src="${orderChartImage}" alt="Order Chart">
      </div>
      <div class="font-semibold">4. Số lượng đơn đặt hàng theo tệp khách hàng</div>
      <div class="flex justify-center w-[80%]">
        <img src="${customerChartImage}" alt="Customer Chart">
      </div>
    `
  } else {
    console.log(orderTimeData, orderLocationData, orderOrderData, orderCustomerData)
    let orderTimeTable = `
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th class="border p-2 capitalize">${Helper.translate(timeRollUp)}</th>
            <th class="border p-2 capitalize">Số lượng đơn hàng</th>
          </tr>
        </thead>
        <tbody>
          ${orderTimeData[0].map((item, index) => {
            return `
              <tr>
                <td class="border p-2 text-center">${item}</td>
                <td class="border p-2 text-center">${orderTimeData[1][index]}</td>
              </tr>
            `
          }).join('')}
        </tbody>
      </table>
    `

    let orderLocationTable = `
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th class="border p-2 capitalize">${Helper.translate(locationRollUp)}</th>
            <th class="border p-2 capitalize">Số lượng đơn hàng</th>
          </tr>
        </thead>
        <tbody>
          ${orderLocationData[0].map((item, index) => {
            return `
              <tr>
                <td class="border p-2 text-center">${item}</td>
                <td class="border p-2 text-center">${orderLocationData[1][index]}</td>
              </tr>
            `
          }).join('')}
        </tbody>
      </table>
    `

    let orderOrderTable = `
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th class="border p-2 capitalize">${Helper.translate(orderRollUp)}</th>
            <th class="border p-2 capitalize">Số lượng đơn hàng</th>
          </tr>
        </thead>
        <tbody>
          ${orderOrderData[0].map((item, index) => {
            return `
              <tr>
                <td class="border p-2 text-center">${item}</td>
                <td class="border p-2 text-center">${orderOrderData[1][index]}</td>
              </tr>
            `
          }).join('')}
        </tbody>
      </table>
    `

    let orderCustomerTable = `
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th class="border p-2 capitalize">${Helper.translate(customerRollUp)}</th>
            <th class="border p-2 capitalize">Số lượng đơn hàng</th>
          </tr>
        </thead>
        <tbody>
          ${orderCustomerData[0].map((item, index) => {
            return `
              <tr>
                <td class="border p-2 text-center">${item}</td>
                <td class="border p-2 text-center">${orderCustomerData[1][index]}</td>
              </tr>
            `
          }).join('')}
        </tbody>
      </table>
    `

    const result = `
      <div class="font-semibold">1. Số lượng đơn đặt hàng theo thời gian</div>
      <div class="flex justify-center w-[90%] mb-2">
        ${orderTimeTable}
      </div>
      <div class="font-semibold">2. Số lượng đơn đặt hàng theo khu vực</div>
      <div class="flex justify-center w-[90%] mb-2">
        ${orderLocationTable}
      </div>
      <div class="font-semibold">3. Số lượng đơn đặt hàng theo phương thức vận chuyển/thanh toán</div>
      <div class="flex justify-center w-[90%] mb-2">
        ${orderOrderTable}
      </div>
      <div class="font-semibold">4. Số lượng đơn đặt hàng theo tệp khách hàng</div>
      <div class="flex justify-center w-[90%] mb-2">
        ${orderCustomerTable}
      </div>
    `
    return result;
  }
}

const contentReportElement = document.querySelector('.fact-order .content-report')

const toggleButton = document.querySelector('button[data-modal-target="pdf-modal-order"]')
toggleButton.addEventListener('click', async function () {
  contentReportElement.innerHTML = await layoutHTML(1)
})

const templates = document.querySelectorAll('input[name="order-template"]')
templates.forEach(template => {
  template.addEventListener('change', async function () {
    contentReportElement.innerHTML = await layoutHTML(this.value)
  })
})

const downloadPDFBtn = document.querySelector('.fact-order .download-pdf-btn')
const opt = {
  margin: [20, 30, 20, 20],
  filename: 'Order Report.pdf',
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
  const preparePDF = document.querySelector('.fact-order .content-to-export')
  html2pdf().set(opt).from(preparePDF).save()
})
