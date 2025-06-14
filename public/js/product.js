
//size-layout
const sizeLayout = document.querySelectorAll(".size-layout")
for (const x of sizeLayout) {
  const y = x.querySelectorAll(".button-size-layout")
  y[0].classList.add("button-size-layout-active")

  for (const z of y) {
    z.addEventListener("click", () => {
      z.classList.add("button-size-layout-active")
      for (const tmp of y) {
        if (tmp != z) tmp.classList.remove("button-size-layout-active")
      }


      const formSizeInput = x.parentNode.parentNode.querySelector(".formCartLayout .sizeInput")
      const formQuantityInput = x.parentNode.parentNode.querySelector(".formCartLayout .quantityInput")

      const sizeId = z.getAttribute("id")
      const stock = z.getAttribute("stock")
      const price = z.getAttribute("price")
      const priceNew = z.getAttribute("priceNew")

      const priceText = x.parentNode.querySelector(".inner-price .inner-price-old")
      const priceN = Number(price)
      const priceS = priceN.toLocaleString('vi', { style: 'currency', currency: 'VND' })

      const priceNewText = x.parentNode.querySelector(".inner-price .inner-price-new")
      const priceNewN = Number(priceNew)
      const priceNewS = priceNewN.toLocaleString('vi', { style: 'currency', currency: 'VND' })

      formSizeInput.setAttribute("value", sizeId)
      formQuantityInput.setAttribute("max", stock)
      priceText.textContent = priceS
      priceNewText.textContent = priceNewS
    })
  }
}

const buttonSize = document.querySelectorAll(".button-size")
if(buttonSize && buttonSize.length > 0){
  buttonSize[0].classList.add("button-size-active")
  buttonSize.forEach(item=>{
    item.addEventListener("click", (e)=>{
      const priceNew = item.getAttribute("priceNew")
      const price = item.getAttribute("price")
      const stock = item.getAttribute("stock")

      const priceNewData = document.querySelector(".inner-price-new .formatMoney")
      let moneyN = Number(priceNew)
      let moneyS = moneyN.toLocaleString('vi', {style : 'currency', currency : 'VND'})
      priceNewData.innerHTML = `${moneyS}`

      const priceData = document.querySelector(".inner-price-old")
      moneyN = Number(price)
      moneyS = moneyN.toLocaleString('vi', {style : 'currency', currency : 'VND'})
      priceData.innerHTML = `${moneyS}`

      const stockData = document.querySelector(".stock")
      stockData.innerHTML = stock

      item.classList.add("button-size-active")
      buttonSize.forEach(item1 =>{
        if(item1!=item){
          item1.classList.remove("button-size-active")
        }
      })

      const sizeValue = document.getElementById("size-value");
      sizeValue.innerText = item.innerText.charAt(0).toUpperCase() + item.innerText.slice(1).toLowerCase();

      const CartInput = document.querySelector(".formCart .sizeInput")
      const stockInput = document.querySelector(".formCart .stockInput")
      CartInput.setAttribute("value", item.getAttribute("id"))
      stockInput.setAttribute("max", item.getAttribute("stock"))
    })
  })
}