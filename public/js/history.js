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
  const qrSection = document.querySelector(".section-qr-history");
  const innerQrSection = qrSection.querySelector(".inner-section-qr");
  if(!qrSection.classList.contains("d-none") && !innerQrSection.contains(e.target)){
    qrSection.classList.add("d-none");
  }
})

const buttonReload = document.querySelector(".button-reload");
if(buttonReload){
  buttonReload.addEventListener("click", (e)=>{
    window.location.reload();
  })
}