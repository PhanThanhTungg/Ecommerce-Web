const paymentStatusSections = document.querySelectorAll(".paymentStatus-section[status='lack']")

if(paymentStatusSections){
  [...paymentStatusSections].forEach(item=>{
    fetch(`/api/checkout/delivery-status/qr/${item.dataset.orderId}`).then(res=>res.json())
      .then(data=>{
        console.log(data);
      }).catch(err=>{
        console.log(err);
      })
  })
}

const buttonQrHistorys = document.querySelectorAll(".button-qr-history");
if(buttonQrHistorys){
  buttonQrHistorys.forEach(button => {
    button.addEventListener("click", (e)=>{
      e.stopPropagation();
      const qrSection = button.parentElement.querySelector(".section-qr-history");
      qrSection.classList.toggle("d-none");
    })
  })
}

// history page
const orderInfos = document.querySelectorAll(".orderInfo");
if(orderInfos){
  console.log(orderInfos);
  orderInfos.forEach((orderInfo) => {
    orderInfo.addEventListener("click", (e) => {
      const orderProduct = orderInfo.parentElement.querySelector(".orderProducts");
      orderProduct.classList.toggle("d-none");
      orderInfo.classList.toggle("active");
    })
  })
}
// end - history page

document.addEventListener("click", (e)=>{
  const innerQrSection = document.querySelector(".inner-section-qr");
  const qrSection = document.querySelector(".section-qr-history");
  if(!qrSection.classList.contains("d-none") && !innerQrSection.contains(e.target)){
    qrSection.classList.add("d-none");
  }
})