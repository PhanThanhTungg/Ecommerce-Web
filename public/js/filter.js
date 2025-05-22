const pagination = document.querySelector(".pagination-product ul");
const limitSelect = document.querySelector(".limit select");
const filterAvailability = document.querySelector(".filter-header .filter-availability");
const filterPrice = document.querySelector(".filter-header .filter-price");

let sortBy = "";
let sortValue = "featured";
let page = 1;
let limit = limitSelect.value;
let priceBegin = 0;
let priceEnd = Math.pow(10,12);
let availability = "";

function fetchAPIProducts(pageSelected = 1) {
  page = pageSelected;
  const api = `/api/products?priceBegin=${priceBegin}&priceEnd=${priceEnd}&sortBy=${sortBy}&sortValue=${sortValue}&availability=${availability}&page=${page}&limit=${limit}`;
  fetch(api)
    .then(res => res.json())
    .then(data => {
      const products = data.products;
      const boxProduct = document.querySelector(".box-product");
      if (products) {
        boxProduct.innerHTML = '';
        products.forEach(item => {
          boxProduct.innerHTML += `
            <a href="/products/detail/${item.slug}">
              <div class="col-xl-4 col-md-4 col-6 mb-4">
                <div class="product-item">
                  <div class="inner-image">
                    <img class="img-product-1" src="${item.images[0].replace('upload/', 'upload/c_limit,w_254/f_auto/')}" alt=${item.title}>
                    <img class="img-product-2" src="${item.images.length > 1 ? item.images[1].replace('upload/', 'upload/c_limit,w_305/f_auto/') : item.images[0].replace('upload/', 'upload/c_limit,w_305/f_auto/')}" alt=${item.title}>
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
                    <div class="inner-title">
                      <a href="/products/detail/${item.slug}">${item.title}</a>
                    </div>
                    <div class="inner-price">
                      ${item.listSize[0] ? `<div class='inner-price-new formatMoney' > ${item.listSize[0].priceNew}$</div>
                      <div class='inner-price-old formatMoney'>${item.listSize[0].price}$</div>` : ``}
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
        //rating
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
        //format money
        const moneyObject = document.querySelectorAll(".formatMoney")
        moneyObject.forEach(item =>{
          const moneyN = Number(item.innerHTML.slice(0,-1))
          const moneyS = moneyN.toLocaleString('vi', {style : 'currency', currency : 'VND'})
          item.innerHTML = moneyS
        })
      }
      createPagination(data.objectPagination.totalPage, data.objectPagination.currentPage);
    })
}
fetchAPIProducts();

function createPagination(totalPages, page) {
  let liTag = '';
  let active;
  let beforePage = page - 1;
  let afterPage = page + 1;

  if (page > 1) {
    liTag += `<li class="btn prev" onclick="fetchAPIProducts(${page - 1})"><span><i class="fas fa-angle-left"></i> Prev</span></li>`;
  }

  if (totalPages <= 5) {
    for (let plength = 1; plength <= totalPages; plength++) {
      active = page == plength ? "active" : "";
      liTag += `<li class="numb ${active}" onclick="fetchAPIProducts(${plength})"><span>${plength}</span></li>`;
    }
  } else {
    if (page > 2) {
      liTag += `<li class="first numb" onclick="fetchAPIProducts(1)"><span>1</span></li>`;
      if (page > 3) {
        liTag += `<li class="dots"><span>...</span></li>`;
      }
    }

    if (page == totalPages) {
      beforePage -= 2;
    } else if (page == totalPages - 1) {
      beforePage -= 1;
    }

    if (page == 1) {
      afterPage += 2;
    } else if (page == 2) {
      afterPage += 1;
    }

    for (let plength = beforePage; plength <= afterPage; plength++) {
      if (plength > totalPages || plength < 1) continue;
      active = page == plength ? "active" : "";
      liTag += `<li class="numb ${active}" onclick="fetchAPIProducts(${plength})"><span>${plength}</span></li>`;
    }

    if (page < totalPages - 1) {
      if (page < totalPages - 2) {
        liTag += `<li class="dots"><span>...</span></li>`;
      }
      liTag += `<li class="last numb" onclick="fetchAPIProducts(${totalPages})"><span>${totalPages}</span></li>`;
    }
  }

  if (page < totalPages) {
    liTag += `<li class="btn next" onclick="fetchAPIProducts(${page + 1})"><span>Next <i class="fas fa-angle-right"></i></span></li>`;
  }

  pagination.innerHTML = liTag;
}

function deleteAvailabilityFilter() {
  availabilityCheck.value = "";
  availabilityCheck.dispatchEvent(new Event('change'));
}

function deletePriceFilter() {
  priceRange.noUiSlider.set([0, 500]);
  filterPrice.innerHTML = "";
}

function clearFilter() {
  deleteAvailabilityFilter();
  deletePriceFilter();
}

function camelCaseToText(str) {
  return str
    .replace(/([A-Z])/g, ' $1') // Thêm khoảng trắng trước chữ in hoa
    .toLowerCase()
    .replace(/^./, function (match) { return match.toUpperCase(); }); // Viết hoa chữ cái đầu
}

limitSelect.addEventListener('change', function () {
  limit = this.value;
  fetchAPIProducts();
})


const availabilityCheck = document.querySelector("#collapseAvailability .availability");

availabilityCheck.addEventListener('change', function () {
  availability = this.value;
  fetchAPIProducts();
  if (this.value !== "") {
    filterAvailability.innerHTML = `
      <span>Availability: ${camelCaseToText(this.value)} </span>
      <button onclick="deleteAvailabilityFilter()"><i class="fi fi-rr-cross-small"></i></button>
  `;
  } else {
    filterAvailability.innerHTML = "";
  }
})


const priceRange = document.querySelector('#collapsePrice .slider-range');
const minPrice = document.getElementById("min-price");
const maxPrice = document.getElementById("max-price");

noUiSlider.create(priceRange, {
  start: [0, 550000000],
  connect: true,
  range: {
    'min': 0,
    'max': 550000000
  }
});

priceRange.noUiSlider.on('update', function (values, handle) {
  if (handle === 0) {
    minPrice.value = Math.round(values[0]);
  } else {
    maxPrice.value = Math.round(values[1]);
  }
});

priceRange.noUiSlider.on('set', function (values, handle) {
  if (handle === 0) {
    priceBegin = Math.round(values[0]);
    fetchAPIProducts();
  } else {
    priceEnd = Math.round(values[1]);
    fetchAPIProducts();
  }
  filterPrice.innerHTML = `
    <span>Price: ${Math.round(values[0])}$ - ${Math.round(values[1])}$</span>
    <button onclick="deletePriceFilter()"><i class="fi fi-rr-cross-small"></i></button>
  `;
})

minPrice.addEventListener('change', function () {
  priceRange.noUiSlider.set([this.value, null]);
});

maxPrice.addEventListener('change', function () {
  priceRange.noUiSlider.set([null, this.value]);
})

const sortSelects = document.querySelectorAll('input[name="sort-form"]');
sortSelects.forEach(item => {
  item.addEventListener('change', function () {
    const sortKey = this.value.split('-');
    sortBy = sortKey[0];
    sortValue = sortKey[1];
    fetchAPIProducts();

    let label = this.closest('label');
    let text = label.querySelector('div').innerText;
    const sortText = document.querySelector(".sort-form a span");
    sortText.innerHTML = `${text}`;
  })
})


document.addEventListener("DOMContentLoaded", function () {
  const collapseAvailability = document.getElementById("collapseAvailability");
  const iconAvailability = document.getElementById("icon-availability");

  $(collapseAvailability).on("show.bs.collapse", function () {
    iconAvailability.classList.remove("fi-rr-angle-down");
    iconAvailability.classList.add("fi-rr-angle-up");
  });

  $(collapseAvailability).on("hide.bs.collapse", function () {
    iconAvailability.classList.remove("fi-rr-angle-up");
    iconAvailability.classList.add("fi-rr-angle-down");
  });

  const collapsePrice = document.getElementById("collapsePrice");
  const iconPrice = document.getElementById("icon-price");

  $(collapsePrice).on("show.bs.collapse", function () {
    iconPrice.classList.remove("fi-rr-angle-down");
    iconPrice.classList.add("fi-rr-angle-up");
  })

  $(collapsePrice).on("hide.bs.collapse", function () {
    iconPrice.classList.remove("fi-rr-angle-up");
    iconPrice.classList.add("fi-rr-angle-down");
  })
});
