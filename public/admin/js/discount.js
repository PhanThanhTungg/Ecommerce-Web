const discountForms = document.querySelectorAll(".Discount-Form");
if (discountForms) {
  discountForms.forEach(discountForm => {
    discountForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = discountForm.getAttribute("data-id");
      const formData = new FormData(discountForm);
      const formDataObject = Object.fromEntries(formData);
      formDataObject.discountId = id;
      const api = id ? "/admin/discount/edit" : "/admin/discount/create";
      fetch(api, {
        method: id ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataObject),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message == "Create discount successfully" || data.message == "Edit discount successfully") {
            window.location.href = "/admin/discount";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
  })
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

