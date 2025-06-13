// --------------- Discount page socket handler ---------------
socket.on("sub-quantity-discount", (data) => {
  const { discountId, quantity } = data;
  console.log("sub-quantity-discount", discountId, quantity);
  const discountItem = document.querySelector(`.discount-item[data-id="${discountId}"]`);
  if (discountItem) {
    const quantityElement = discountItem.querySelector(".discount-quantity");
    console.log("quantityElement", quantityElement);
    if (quantityElement) {
      quantityElement.innerHTML = `${quantity}`;
    }
  }
});

const discountItems = document.querySelectorAll(".discount-item");
