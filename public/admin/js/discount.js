const CUDiscountForm = document.getElementById("CUDiscountForm");
if(CUDiscountForm){
  CUDiscountForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const formData = new FormData(CUDiscountForm);
  const formDataObject = Object.fromEntries(formData);
  const api = "/admin/discount/create";
  fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formDataObject),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.message = "Create discount successfully") {
        window.location.href = "/admin/discount";
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
}

// --------------- Discount page socket handler ---------------
socket.on("sub-quantity-discount", (data) => {
  const { discountId, quantity } = data;
  console.log("sub-quantity-discount", discountId, quantity);
  const discountItem = document.querySelector(`tr[data-id="${discountId}"]`);
  if (discountItem) {
    const quantityElement = discountItem.querySelector(".discount-quantity");
    console.log("quantityElement", quantityElement);
    if (quantityElement) {
      quantityElement.innerHTML = `${quantity}`;
    }
  }
});

