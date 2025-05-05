document.addEventListener("DOMContentLoaded", function () {
  let type = 'featured';
  let page = 1;
  let totalPage = 1;
  const boxProduct = document.querySelector(".home .section-products-featured .box-product");
  const buttonPrev = document.querySelector('.home .section-products-featured button.prev');
  const buttonNext = document.querySelector('.home .section-products-featured button.next');
  
  async function fetchAPI() {
    fetch(`/api/products/type/${type}?page=${page}`)
      .then(res => res.json())
      .then(data => {
        totalPage = data.objectPagination.totalPage;

        if (page !== 1 && (!data.products || data.products.length === 0)) {
          page = 1;
          fetchAPI();
          return;
        }

        const products = data.products;
        
        if (page <= 1) {
          buttonPrev.disabled = true;
        } else {
          buttonPrev.disabled = false;
        }
        if (page >= totalPage) {
          buttonNext.disabled = true;
        } else {
          buttonNext.disabled = false;
        }

        if (products) {
          boxProduct.innerHTML = ``;
          products.forEach(item => {
            boxProduct.innerHTML += `
              <a href="/products/detail/${item.slug}">
                <div class="col-xl-3 col-md-4 col-sm-6 mb-5">
                  <div class="product-item">
                    <div class="inner-image">
                      <img class="img-product-1" src="${item.images[0]}" alt=${item.title}>
                      <img class="img-product-2" src="${item.images.length > 1 ? item.images[1] : item.images[0].replace}" alt=${item.title}>
                      ${item.featured == "1" ? '<div class="inner-featured">Trending</div>' : ''}
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
                      <div class="inner-title px-4">
                        <a href="/products/detail/${item.slug}">${item.title}</a>
                      </div>
                      <div class="inner-price">
                        ${item.listSize[0] ? `<div class='inner-price-new formatMoney' > ${Math.round(item.listSize[0].price * (1 - item.discountPercentage / 100))}$</div>
                        <div class='inner-price-old formatMoney'>$${item.listSize[0].price}</div>` : ``}
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
          
          const rating_wrappers = document.querySelectorAll(".inner-rating");
          if (rating_wrappers) {
            rating_wrappers.forEach(rating => {
              const ratingNumber = rating.dataset.rating;
              const ratingInput = rating.querySelector(`input[value="${ratingNumber}"]`);
              if (ratingNumber > 0) {
                ratingInput.checked = true;
              }
            })
          }
          const moneyObject = document.querySelectorAll(".formatMoney")
          moneyObject.forEach(item =>{
            const moneyN = Number(item.innerHTML.slice(0,-1))
            const moneyS = moneyN.toLocaleString('vi', {style : 'currency', currency : 'VND'})
            item.innerHTML = moneyS
          })
        }

      })
      .catch(error => {
        console.error(error);
      })
  }
  fetchAPI();

  const buttonGroup = document.querySelectorAll(".home .section-products-featured .inner-button button");
  buttonGroup.forEach(item => {
    item.addEventListener('click', function () {
      type = this.value;
      buttonGroup.forEach(item => {
        item.classList.remove("active");
      })
      this.classList.add("active");
      fetchAPI();
    })
  })
  
  buttonPrev.addEventListener('click', function() {
    page = page > 1? page - 1 : 1;
    fetchAPI();
  });
  buttonNext.addEventListener('click', function() {
    page = page < totalPage? page + 1 : totalPage;
    fetchAPI();
  });


})