let timeRollUp = "month"
let productRollUp = "category"

let timeDice = "";
let productDice = "";
let sortFeedback = "desc";

const timeInputRadios = document.querySelectorAll('input[name="feedbackTime"]')
const productInputRadios = document.querySelectorAll('input[name="feedbackProduct"]')

const inputTimeDice = document.querySelector('.fact-feedback .list-time');
const inputProductDice = document.querySelector('.fact-feedback .list-product');

let feedbackTimeChart = null;
let feedbackProductChart = null;

const feedbackTimeInputs = document.querySelectorAll('input[name="feedbackTime"]');
if (feedbackTimeInputs) {
  feedbackTimeInputs.forEach((input) => {
    input.addEventListener('change', function () {
      document.querySelectorAll('input[name="feedbackTime"]').forEach((el) => {
        el.nextElementSibling.classList.remove('active', 'bg-gray-500', 'text-white');
      });
      if (this.checked) {
        this.nextElementSibling.classList.add('active', 'bg-gray-500', 'text-white');
      }
    });
  });
}
const feedbackProductInputs = document.querySelectorAll('input[name="feedbackProduct"]');
if (feedbackProductInputs) {
  feedbackProductInputs.forEach((input) => {
    input.addEventListener('change', function () {
      document.querySelectorAll('input[name="feedbackProduct"]').forEach((el) => {
        el.nextElementSibling.classList.remove('active', 'bg-gray-500', 'text-white');
      });
      if (this.checked) {
        this.nextElementSibling.classList.add('active', 'bg-gray-500', 'text-white');
      }
    });
  });
}

const feedbackAPI = "/api/dashboard/olap/fact_feedback";

async function getFeedbackData(reqBody) {
  try {
    const res = await fetch(feedbackAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reqBody)
    })
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching feedback data:", error);
    return null;
  }
}

let feedbackTimeData = [];
let feedbackProductData = [];
async function renderFeedbackTimeChart() {
  if (feedbackTimeChart) {
    feedbackTimeChart.destroy();
  }
  const reqBody = {
    timeRollUp: timeRollUp,
    timeDice: timeDice,
    productDice: productDice,
  }

  let feedbackTimeChartOptions = {
    series: [],
    chart: {
      height: 350,
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
      curve: "smooth"
    },
    noData: {
      text: 'Loading...'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 3,
        borderRadiusApplication: 'end'
      },
    },
    yaxis: [
      {
        seriesName: 'AVG Rating',
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
        },
        title: {
          text: "AVG Rating",          
        },
        tooltip: {
          enabled: false
        },
        min: 0,
      },
      {
        seriesName: 'Number of Feedback',
        opposite: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
        },
        title: {
          text: "Number of Feedback",
        },
        tooltip: {
          enabled: true
        },
      },
    ],
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

  feedbackTimeChart = new ApexCharts(
    document.querySelector(".fact-feedback .time-chart"),
    feedbackTimeChartOptions
  );
  feedbackTimeChart.render();

  const data = await getFeedbackData(reqBody);
  const numberOfRecords = data.AVG_Rating.length;
  let dataLabels = [];
  for (let i = 0; i < numberOfRecords; i++) {
    let label = data.year[i];
    if (timeRollUp === "month") {
      label = data.month[i] + "-" + data.year[i];
    } else if (timeRollUp === "day") {
      label = data.day[i] + "-" + data.month[i] + "-" + data.year[i];
    }
    dataLabels.push(label);
  }
  feedbackTimeData = [dataLabels, data.AVG_Rating, data.Rating_1_Count, data.Rating_2_Count, data.Rating_3_Count, data.Rating_4_Count, data.Rating_5_Count];
  feedbackTimeChart.updateOptions({
    plotOptions: {
      bar: {
        columnWidth: numberOfRecords < 5? '20%' : '55%',
      },
    },
    series: [
      {
        name: "AVG Rating",
        data: data.AVG_Rating,
        type: 'line', 
        color: '#008FFB'
      },
      {
        name: "5-star ratings",
        data: data.Rating_5_Count,
        type: 'bar',
        color: '#00E396'
      },
      {
        name: "4-star ratings",
        data: data.Rating_4_Count,
        type: 'bar',
        color: '#03e3fc'
      },
      {
        name: "3-star ratings",
        data: data.Rating_3_Count,
        type: 'bar',
        color: '#fcbe62'
      },
      {
        name: "2-star ratings",
        data: data.Rating_2_Count,
        type: 'bar',
        color: '#f78928'
      },
      {
        name: "1-star ratings",
        data: data.Rating_1_Count,
        type: 'bar',
        color: '#f72828'
      }
    ],
    xaxis: {
      categories: dataLabels
    },
  });
}

async function renderFeedbackProductChart() {
  if (feedbackProductChart) {
    feedbackProductChart.destroy();
  }
  const reqBody = {
    productRollUp: productRollUp,
    productDice: productDice,
    timeDice: timeDice,
    sort: sortFeedback,
  }

  let feedbackProductChartOptions = {
    series: [],
    chart: {
      height: 350,
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
      curve: "smooth"
    },
    noData: {
      text: 'Loading...'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 3,
        borderRadiusApplication: 'end'
      },
    },
    yaxis: [
      {
        seriesName: 'AVG Rating',
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
        },
        title: {
          text: "AVG Rating",
        },
        tooltip: {
          enabled: false
        },
        min: 0,
      },
      {
        seriesName: 'Number of Feedback',
        opposite: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
        },
        title: {
          text: "Number of Feedback",
        },
        tooltip: {
          enabled: true
        },
      },
    ],
    legend: {
      position: 'left',
      offsetY: 20
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
    },
  }

  feedbackProductChart = new ApexCharts(
    document.querySelector(".fact-feedback .product-chart"),
    feedbackProductChartOptions
  );
  feedbackProductChart.render();

  let data = await getFeedbackData(reqBody);
  data = {
    AVG_Rating: data.AVG_Rating.slice(-34),
    Rating_1_Count: data.Rating_1_Count.slice(-34),
    Rating_2_Count: data.Rating_2_Count.slice(-34),
    Rating_3_Count: data.Rating_3_Count.slice(-34),
    Rating_4_Count: data.Rating_4_Count.slice(-34),
    Rating_5_Count: data.Rating_5_Count.slice(-34),
    category_name: data.category_name?.slice(-34) || null,
    product_name: data.product_name?.slice(-34) || null,
    category_key: data.category_key?.slice(-34) || null,
    product_key: data.product_key?.slice(-34) || null,
  }
  let labels = data.category_name || data.product_name
  feedbackProductData = [labels, data.AVG_Rating, data.Rating_1_Count, data.Rating_2_Count, data.Rating_3_Count, data.Rating_4_Count, data.Rating_5_Count];

  feedbackProductChart.updateOptions({
    series: [
      {
        name: "AVG Rating",
        type: 'line',
        data: data.AVG_Rating,
        color: '#008FFB'
      },
      {
        name: "5-star ratings",
        type: 'bar',
        data: data.Rating_5_Count,
        color: '#00E396'
      },
      {
        name: "4-star ratings",
        type: 'bar',
        data: data.Rating_4_Count,
        color: '#03e3fc'
      },
      {
        name: "3-star ratings",
        type: 'bar',
        data: data.Rating_3_Count,
        color: '#fcbe62'
      },
      {
        name: "2-star ratings",
        type: 'bar',
        data: data.Rating_2_Count,
        color: '#f78928'
      },
      {
        name: "1-star ratings",
        type: 'bar',
        data: data.Rating_1_Count,
        color: '#f72828'
      }    
      
    ],
    xaxis: {
      categories: data.category_name || data.product_name,
      labels: {
        trim: true,
        maxHeight: 70,
        style: {
          textOverflow: 'ellipsis'
        }
      }
    }
  });

  const numberOfRecords = data.AVG_Rating.length;
  productDiceValue = [];
  for (let i = 0; i < numberOfRecords; i++) {
    if (productRollUp == "category") {
      productDiceValue.push({
        category_key: data.category_key[i],
        category_name: data.category_name[i],
      })
    } else {
      productDiceValue.push({
        product_key: data.product_key[i],
        product_name: data.product_name[i],
      })
    }
  }
}

async function renderAllFeedbackChart() {
  await renderFeedbackTimeChart();
  await renderFeedbackProductChart();
}

// DICE
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
              name="feedback-product"
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

const timeDiceForm = document.querySelector('.fact-feedback .time-dice-form')
const productDiceForm = document.querySelector('.fact-feedback .product-dice-form')

timeDiceForm.addEventListener('submit', async function (e) {
  e.preventDefault()
  const data = e.target.elements;
  timeDice = {
    start: data.start.value,
    end: data.end.value
  }
  if (data.start.value == "" || data.end.value == "") timeDice = ""
  const temp = await getFeedbackData({
    timeRollUp: timeRollUp,
    timeDice: timeDice,
    productDice: productDice,
  });

  if (Object.keys(temp).length === 0) {
    alert("No data available for this time period. Please enter a different time range.")
    timeDice = "";
    data.start.value = ""
    data.end.value = ""
    return
  }

  await renderAllFeedbackChart()
})

productDiceForm.addEventListener('submit', async function (e) {
  e.preventDefault()
  const formData = new FormData(this)
  productDice = {
    type: productRollUp,
    arr: formData.getAll('feedback-product')
  }
  await renderAllFeedbackChart()
})

//END DICE

//Roll up
timeInputRadios.forEach(radio => {
  radio.addEventListener('change', async function () {
    timeRollUp = this.value
    if (timeDice != "") {
      timeDice = ""
      await renderAllFeedbackChart()
    } else {
      await renderFeedbackTimeChart()
    }
    renderTimeDice()
  })
})

productInputRadios.forEach(radio => {
  radio.addEventListener('change', async function () {
    productRollUp = this.value
    if (productDice != "") {
      productDice = ""
      await renderAllFeedbackChart()
    } else {
      await renderFeedbackProductChart()
    }
    renderProductDice()
  })
})
//End roll up

async function action() {
  await renderAllFeedbackChart();
  renderTimeDice();
  renderProductDice();
}
action();

//export PDF
const getChartImage = async (chart) => {
  return await chart.dataURI().then(({ imgURI }) => {
    return imgURI;
  });
};

async function layoutHTML(template) {
  if (template == 2) {
    const timeChartImage = await getChartImage(feedbackTimeChart)
    const productChartImage = await getChartImage(feedbackProductChart)
    
    return `
      <div class="font-semibold">1. Đánh giá khách hàng theo thời gian</div>
      <div class="flex justify-center w-[80%]">
        <img src="${timeChartImage}" alt="Time Chart">
      </div>
      <div class="font-semibold">2. Đánh giá khách hàng theo sản phẩm</div>
      <div class="flex justify-center w-[80%]">
        <img src="${productChartImage}" alt="Product Chart">
      </div>
    `
  } else {
    let feedbackTimeTable = `
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th class="border p-2 capitalize">${Helper.translate(timeRollUp)}</th>
            <th class="border p-2 capitalize">Điểm trung bình</th>
            <th class="border p-2 capitalize">1 ⭐</th>
            <th class="border p-2 capitalize">2 ⭐</th>
            <th class="border p-2 capitalize">3 ⭐</th>
            <th class="border p-2 capitalize">4 ⭐</th>
            <th class="border p-2 capitalize">5 ⭐</th>
          </tr>
        </thead>
        <tbody>
          ${feedbackTimeData[0].map((item, index) => {
            return `
              <tr>
                <td class="border p-2 text-center">${item}</td>
                <td class="border p-2 text-center">${feedbackTimeData[1][index]}</td>
                <td class="border p-2 text-center">${feedbackTimeData[2][index]}</td>
                <td class="border p-2 text-center">${feedbackTimeData[3][index]}</td>
                <td class="border p-2 text-center">${feedbackTimeData[4][index]}</td>
                <td class="border p-2 text-center">${feedbackTimeData[5][index]}</td>
                <td class="border p-2 text-center">${feedbackTimeData[6][index]}</td>
              </tr>
            `
          }).join('')}
        </tbody>
      </table>
    `

    let feedbackProductTable = `
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th class="border p-2 capitalize">${Helper.translate(productRollUp)}</th>
            <th class="border p-2 capitalize">Điểm trung bình</th>
            <th class="border p-2 capitalize">1 ⭐</th>
            <th class="border p-2 capitalize">2 ⭐</th>
            <th class="border p-2 capitalize">3 ⭐</th>
            <th class="border p-2 capitalize">4 ⭐</th>
            <th class="border p-2 capitalize">5 ⭐</th>
          </tr>
        </thead>
        <tbody>
          ${feedbackProductData[0].map((item, index) => {
            return `
              <tr>
                <td class="border p-2 text-center">${item}</td>
                <td class="border p-2 text-center">${feedbackProductData[1][index]}</td>
                <td class="border p-2 text-center">${feedbackProductData[2][index]}</td>
                <td class="border p-2 text-center">${feedbackProductData[3][index]}</td>
                <td class="border p-2 text-center">${feedbackProductData[4][index]}</td>
                <td class="border p-2 text-center">${feedbackProductData[5][index]}</td>
                <td class="border p-2 text-center">${feedbackProductData[6][index]}</td>
              </tr>
            `
          }).join('')}
        </tbody>
      </table>
    `

    const result = `
      <div class="font-semibold">1. Đánh giá khách hàng theo thời gian</div>
      <div class="flex justify-center w-[90%] mb-2">
        ${feedbackTimeTable}
      </div>
      <div class="font-semibold">2. Đánh giá khách hàng theo sản phẩm</div>
      <div class="flex justify-center w-[90%] mb-2">
        ${feedbackProductTable}
      </div>
    `
    return result;
  }
}

const contentReportElement = document.querySelector('.fact-feedback .content-report');

const toggleButton = document.querySelector('button[data-modal-target="pdf-modal-feedback"]')
toggleButton.addEventListener('click', async function () {
  contentReportElement.innerHTML = await layoutHTML(1)
})

const templates = document.querySelectorAll('input[name="feedback-template"]');
templates.forEach(template => {
  template.addEventListener('change', async function () {
    
    contentReportElement.innerHTML = await layoutHTML(this.value)
  })
})

const downloadPDFButton3 = document.querySelector('#download-feedback-pdf');
const opt = {
  margin: [20, 30, 20, 20],
  filename: 'Feedback Report.pdf',
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

downloadPDFButton3.addEventListener('click', async function () {
  const prepareExport = document.getElementById('feedback-export-content')
  console.log(prepareExport)
  html2pdf().set(opt).from(prepareExport).save()
})