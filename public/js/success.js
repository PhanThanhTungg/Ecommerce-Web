// check checkout status
let intervalFun;
const apiCheckoutStatus = async (orderId) => {
  try {
    const response = await fetch(`/api/checkout/delivery-status/qr/${orderId}`);
    const data = await response.json();
    console.log(data.paymentStatus.status)
    if(data.paymentStatus.status == "lack"){
      console.log(data.paymentStatus.lack);
      const amountIn = +data.amountIn;
      if(amountIn != 0){
        // const totalPriceBanking = document.querySelector(".info-bank-account .totalPriceBanking");
        const formattedAmount = data.lack.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        const totalLackTag = document.querySelector(".totalLack");
        totalLackTag.classList.remove("d-none");
        totalLackTag.querySelector("span").innerText = formattedAmount;

        const imgQR = document.querySelector(".section-qr img");
        const src = imgQR.getAttribute("src")
        imgQR.setAttribute("src", src.replace(/amount=\d+/, `amount=${data.lack}`));
      }
    }
    else if (data.paymentStatus.status == "ok"){
      clearInterval(intervalFun);
      const sectionQr = document.querySelector(".section-qr");
      sectionQr.classList.add("d-none");
      const successBox = document.querySelector(".success-box");
      successBox.classList.remove("d-none");
      const notification = document.querySelector(".notification");
      notification.classList.add("d-none");
    };
  } catch (error) {
    console.error("Error fetching checkout status:", error);
  }
};

const successPage = document.querySelector(".success");
if(successPage){
  const paymentMethod = successPage.dataset.paymentMethod;
  if(paymentMethod == "qr"){
    const orderId = successPage.dataset.orderId;
    apiCheckoutStatus(orderId);
    intervalFun = setInterval(() => {
      apiCheckoutStatus(orderId);
    }, 10000);
  }
}


// end - check checkout status