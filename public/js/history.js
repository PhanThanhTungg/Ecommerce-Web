const buttonQrHistorys = document.querySelectorAll(".button-qr-history");
if(buttonQrHistorys){
  buttonQrHistorys.forEach(button => {
    button.addEventListener("click", (e)=>{
      e.stopPropagation();
      const qrSection = button.parentElement.querySelector(".section-qr-history");
      qrSection.classList.remove("d-none");
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
  const qrSection = document.querySelector(".section-qr-history:not(.d-none");
  if(qrSection){
    const innerSection = qrSection.querySelector(".inner-section-qr");
    if(!innerSection.contains(e.target) && !e.target.classList.contains("button-qr-history")){
      console.log("close qr section");
      qrSection.classList.add("d-none");
    }
  }
})

const buttonReload = document.querySelector(".button-reload");
if(buttonReload){
  buttonReload.addEventListener("click", (e)=>{
    window.location.reload();
  })
}