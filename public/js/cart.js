//input number event
const inputNumbers = document.querySelectorAll(".input__number");
if(inputNumbers){
  inputNumbers.forEach(inputNumber=>{
    const subSpan = inputNumber.querySelector(".sub");
    const addSpan = inputNumber.querySelector(".add");
    const inputValue = inputNumber.querySelector("input");
    const productId = inputValue.getAttribute("item-id")
    const sizeId = inputValue.getAttribute("sizeId");
    const stock = +inputValue.getAttribute("max");

    inputValue.addEventListener("change", ()=>{
      inputValue.value = Math.max(1,+inputValue.value);
      inputValue.value = Math.min(+inputValue.value, stock);
      fetch(`/cart/update/${productId}/${sizeId}/${inputValue.value}`).then(res=>res.json())
      .then(data=>console.log(data));
    })
    subSpan.addEventListener("click", ()=>{
      inputValue.value = Math.max(1,+inputValue.value-1);
      fetch(`/cart/update/${productId}/${sizeId}/${inputValue.value}`).then(res=>res.json())
      .then(data=>console.log(data));
    })
    addSpan.addEventListener("click", ()=>{
      inputValue.value = Math.min(+inputValue.value+1,stock);
      fetch(`/cart/update/${productId}/${sizeId}/${inputValue.value}`).then(res=>res.json())
      .then(data=>console.log(data));
    })
  })
}

//delete item
const deleteIcons = document.querySelectorAll("[table-cart] .icon-delete");
if(deleteIcons){
  deleteIcons.forEach(deleteIcon=>{
    deleteIcon.addEventListener("click", ()=>{
      const api = deleteIcon.dataset.api;
      fetch(api).then(res=>res.json())
      .then(data=>{
        if(data.code==200){
          const rowDelete = deleteIcon.closest("tr");
          rowDelete.parentElement.removeChild(rowDelete);
        }
      })
    })
  })
}


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
  })
}
getRelatedProducts();


//end - call api to get related products

