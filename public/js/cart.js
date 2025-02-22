//Cập nhật số lượng sản phẩm trong giỏ hàng
const tableCart = document.querySelector("[table-cart]")
if(tableCart) {
  const inputsQuantity = tableCart.querySelectorAll("input[name='quantity']")

  inputsQuantity.forEach(input => {
    input.addEventListener("change", () => {
      const productId = input.getAttribute("item-id")
      const quantity = input.value
      const sizeId = input.getAttribute("sizeId")

      window.location.href = `/cart/update/${productId}/${sizeId}/${quantity}`;
    })
  })
}

//end-Cập nhật số lượng sản phẩm trong giỏ hàng

