
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



//size
// const buttonSize = document.querySelectorAll(".button-size")
// if(buttonSize){
//   buttonSize[0].classList.add("button-size-active")
//   buttonSize.forEach(item=>{
//     item.addEventListener("click", (e)=>{
//       const priceNew = item.getAttribute("priceNew")
//       const price = item.getAttribute("price")
//       const stock = item.getAttribute("stock")

//       const priceNewData = document.querySelector(".inner-price-new .formatMoney")
//       let moneyN = Number(priceNew)
//       let moneyS = moneyN.toLocaleString('vi', {style : 'currency', currency : 'VND'})
//       priceNewData.innerHTML = `${moneyS}`

//       const priceData = document.querySelector(".inner-price-old")
//       moneyN = Number(price)
//       moneyS = moneyN.toLocaleString('vi', {style : 'currency', currency : 'VND'})
//       priceData.innerHTML = `${moneyS}`

//       const stockData = document.querySelector(".stock")
//       stockData.innerHTML = stock

//       item.classList.add("button-size-active")
//       buttonSize.forEach(item1 =>{
//         if(item1!=item){
//           item1.classList.remove("button-size-active")
//         }
//       })

//       const CartInput = document.querySelector(".formCart .sizeInput")
//       const stockInput = document.querySelector(".formCart .stockInput")
//       CartInput.setAttribute("value", item.getAttribute("id"))
//       stockInput.setAttribute("max", item.getAttribute("stock"))
//     })
//   })
// }

// call api  /product/:slugCategory
const sortSelect = document.querySelector("[sort-select]");
if (sortSelect) {
  const href = new URL(window.location.href);
  sortSelect.addEventListener('change', (e) => {
    const [sortBy, sortValue] = e.target.value.split("-");
    href.searchParams.set("sortBy", sortBy);
    href.searchParams.set("sortValue", sortValue);
    history.pushState({}, "", href.href);
    const api = "/api" + href.pathname + href.search;
    fetch(api).then(res => res.json()).then(data => {
      const products = data.products;
      const boxProduct = document.querySelector(".box-product");
      if (products) {
        boxProduct.innerHTML = '';
        products.forEach(item => {
          boxProduct.innerHTML += `
            <a href="/products/detail/${item.slug}">
              <div class="col-xl-3 col-md-4 col-6 mb-3">
                <div class="product-item">
                  <div class="inner-image">
                    <img class="img-product-1" src="${item.images[0]}" alt="{item.title}">
                    <img class="img-product-2" src="${item.images.length > 1 ? item.images[1] : item.images[0]}" alt="${item.title}">
                    ${item.featured == "1" ? '<div class="inner-featured">Trending</div>':''}
                  </div>
                  <div class="inner-content">
                    <div class="inner-rating" data-rating="${item.ratingNumber}">
                      <form class="rating">
                        <input id="star5" type="radio" name="rating" value="5" disabled>
                        <label class="full" for="star5" title="Awesome - 5 stars"></label>
                        
                        <input id="star4half" type="radio" name="rating" value="4.5" disabled>
                        <label class="half" for="star4half" title="Pretty good - 4.5 stars"></label>
                        
                        <input id="star4" type="radio" name="rating" value="4" disabled>
                        <label class="full" for="star4" title="Pretty good - 4 stars"></label>
                        
                        <input id="star3half" type="radio" name="rating" value="3.5" disabled>
                        <label class="half" for="star3half" title="Meh - 3.5 stars"></label>
                        
                        <input id="star3" type="radio" name="rating" value="3" disabled>
                        <label class="full" for="star3" title="Meh - 3 stars"></label>
                        
                        <input id="star2half" type="radio" name="rating" value="2.5" disabled>
                        <label class="half" for="star2half" title="Kinda bad - 2.5 stars"></label>
                        
                        <input id="star2" type="radio" name="rating" value="2" disabled>
                        <label class="full" for="star2" title="Kinda bad - 2 stars"></label>
                        
                        <input id="star1half" type="radio" name="rating" value="1.5" disabled>
                        <label class="half" for="star1half" title="Meh - 1.5 stars"></label>
                        
                        <input id="star1" type="radio" name="rating" value="1" disabled>
                        <label class="full" for="star1" title="Sucks big time - 1 star"></label>
                        
                        <input id="starhalf" type="radio" name="rating" value="0.5" disabled>
                        <label class="half" for="starhalf" title="Sucks big time - 0.5 stars"></label>
                      </form>
                    </div>
                    <div class="inner-title">
                      <a href="/products/detail/${item.slug}">${item.title}</a>
                    </div>
                    <div class="inner-price">
                      ${item.listSize[0]?`<div class='inner-price-new' > $${item.listSize[0].priceNew }</div>
                      <div class='inner-price-old'>$${item.listSize[0].price}</div>`:``}
                    </div>
                    <div class="inner-discount">
                      <i class="fa-solid fa-bolt"></i> -${item.discountPercentage}%
                    </div>
                  </div>
                </div>
              </div>
            </a>
          `
        });
      }
    })
  })
}




