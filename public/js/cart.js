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

//call api to get related products
const getRelatedProducts = ()=>{
  const trs = document.querySelectorAll(".table-cart tbody tr");
  const listCategory = [...trs].map(item=>{
    return item.dataset.categoryId;
  })
  fetch("/api/cart/getRelatedProductByCategory",{
    method:"POST",
    headers:{
      "Content-Type": "application/json",
    },
    body: JSON.stringify({listCategory})
  }).then(res=>res.json()).then(data=>{
    console.log(data);
  })
}
getRelatedProducts();


//end - call api to get related products

