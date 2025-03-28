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
    button.addEventListener("click", ()=>{
      const qrSection = button.parentElement.querySelector(".section-qr-history");
      qrSection.classList.toggle("d-none");
    })
  })
}