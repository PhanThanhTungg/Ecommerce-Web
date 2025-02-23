const statistic = document.querySelector("[statistic]");
const statisticData = JSON.parse(statistic.getAttribute("statistic"));
//Product chart
const productChart = document.querySelector(".Product-chart");
console.log();
new Chart(productChart, {
  type: 'pie',
  data: {
    labels: Object.keys(statisticData.Product),
    datasets: [{
      label: 'Product',
      data: Object.values(statisticData.Product),
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4,
    }],
  },
  options: {
    // layout: {
    //   padding: {
    //     top: 50
    //   }
    // },
    plugins: {
      legend: {
        labels: {
          color: '#fff', // 
          font: {
            size: 16, //  
          },
        },
        position: 'bottom'
      }
    }
  }
});
