var swiper = new Swiper(".thumbnail-detail", {
  spaceBetween: 0,
  slidesPerView: "auto",
  freeMode: true,
  watchSlidesProgress: true,
});
var swiper2 = new Swiper(".image-detail", {
  spaceBetween: 0,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  thumbs: {
    swiper: swiper,
  },
});

document.querySelectorAll("form").forEach(item => {
  item.addEventListener("submit", function(e) {
    const btnSubmit = this.querySelector("button[type='submit']");
    btnSubmit.disabled = true;
    setTimeout(() => {
      btnSubmit.disabled = false;
    }, 500);
  });
})

const subQty = document.querySelector(".product-detail .formCart .sub");
const addQty = document.querySelector(".product-detail .formCart .add");
const inputQty = document.querySelector(".product-detail .formCart .stockInput");

subQty.addEventListener('click', function() {
  if(inputQty.value > 1) {
    inputQty.value = parseInt(inputQty.value) - 1;
  } else {
    inputQty.value = 1;
  }
});

addQty.addEventListener('click', function() {
  inputQty.value = parseInt(inputQty.value) + 1;
});

document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.product-single__tab .container');
  if (container) {
    container.classList.remove("container");
  }
})