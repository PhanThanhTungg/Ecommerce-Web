const buttonQrHistorys = document.querySelectorAll(".button-qr-history");
if (buttonQrHistorys) {
  buttonQrHistorys.forEach(button => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const qrSection = button.parentElement.querySelector(".section-qr-history");
      qrSection.classList.remove("d-none");
    })
  })
}

const buttonZaloPays = document.querySelectorAll(".button-zalopay");
if(buttonZaloPays){
  buttonZaloPays.forEach(button => {
    button.addEventListener("click", (e) => {
      const orderId = e.currentTarget.dataset.orderId;
      const lack = e.currentTarget.dataset.orderLack;
      location.href = `/checkout/zalopay/${orderId}/${lack}`;
    })
  })
}

// history page
const orderInfos = document.querySelectorAll(".orderInfo");
if (orderInfos) {
  orderInfos.forEach((orderInfo) => {
    orderInfo.addEventListener("click", (e) => {
      const orderProduct = orderInfo.parentElement.querySelector(".orderProducts");
      orderProduct.classList.toggle("d-none");
      orderInfo.classList.toggle("active");
    })
  })
}
// end - history page

document.addEventListener("click", (e) => {
  const qrSection = document.querySelector(".section-qr-history:not(.d-none");
  if (qrSection) {
    const innerSection = qrSection.querySelector(".inner-section-qr");
    if (!innerSection.contains(e.target) && !e.target.classList.contains("button-qr-history")) {
      console.log("close qr section");
      qrSection.classList.add("d-none");
    }
  }
})

const buttonReload = document.querySelector(".button-reload");
if (buttonReload) {
  buttonReload.addEventListener("click", (e) => {
    const orderIds = document.querySelectorAll("[data-order-id][data-payment-method='qr'][data-payment-status='lack']");
    console.log(orderIds);
    for (const orderId of orderIds) {
      fetch(`/api/checkout/delivery-status/qr/${orderId.dataset.orderId}`).then(res => res.json())
        .then(data => {
          console.log(data);
        })
    }
    window.location.reload();
  })
}